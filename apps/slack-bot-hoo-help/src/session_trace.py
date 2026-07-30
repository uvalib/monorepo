"""
session_trace.py — Structured per-turn transcripts for HooHelp MCP development.

Captures user prompt, system-prompt hash, tool calls (name/args/results/latency),
and final model + Slack text. Emit destinations controlled by CONVERSATION_TRACE:

  off         — do not emit
  cloudwatch  — one JSON log line (default)
  s3          — full JSON object to S3
  both        — CloudWatch summary + full S3 object

CloudWatch lines are marked with event="hoohelp_session_trace" for Logs Insights.
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Marker field so CloudWatch Logs Insights can filter:
#   fields @timestamp, request_id, user_message, tools_used, s3_uri
#   | filter event = "hoohelp_session_trace"
TRACE_EVENT = "hoohelp_session_trace"

# CloudWatch single-line practical limit is high, but keep tool bodies bounded
DEFAULT_CW_TOOL_CHARS = int(os.environ.get("CONVERSATION_TRACE_MAX_TOOL_CHARS", "6000"))
DEFAULT_CW_TEXT_CHARS = int(os.environ.get("CONVERSATION_TRACE_MAX_TEXT_CHARS", "4000"))


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def system_prompt_hash(system_prompt: str) -> str:
    """Stable short hash of the full system prompt (including date context)."""
    return hashlib.sha256(system_prompt.encode("utf-8")).hexdigest()[:16]


def _truncate(value: str, max_chars: int) -> Dict[str, Any]:
    if value is None:
        return {"text": "", "truncated": False, "chars": 0}
    text = str(value)
    n = len(text)
    if n <= max_chars:
        return {"text": text, "truncated": False, "chars": n}
    return {
        "text": text[:max_chars] + f"\n… [truncated {n - max_chars} more chars]",
        "truncated": True,
        "chars": n,
    }


def normalize_trace_mode(raw: Optional[str] = None) -> str:
    mode = (raw if raw is not None else os.environ.get("CONVERSATION_TRACE", "cloudwatch")).strip().lower()
    if mode in ("0", "false", "no", "none", "disabled"):
        return "off"
    if mode in ("cw", "logs", "log"):
        return "cloudwatch"
    if mode not in ("off", "cloudwatch", "s3", "both"):
        logger.warning("Unknown CONVERSATION_TRACE=%r; using cloudwatch", mode)
        return "cloudwatch"
    return mode


@dataclass
class ToolStep:
    tool_use_id: str
    tool_name: str
    input: Dict[str, Any]
    output: str
    latency_ms: int
    iteration: int
    status: str = "success"
    error: Optional[str] = None

    def to_dict(self, max_output_chars: Optional[int] = None) -> Dict[str, Any]:
        out: Dict[str, Any] = {
            "tool_use_id": self.tool_use_id,
            "tool_name": self.tool_name,
            "input": self.input,
            "latency_ms": self.latency_ms,
            "iteration": self.iteration,
            "status": self.status,
        }
        if self.error:
            out["error"] = self.error
        if max_output_chars is None:
            out["output"] = self.output
            out["output_chars"] = len(self.output or "")
        else:
            trunc = _truncate(self.output or "", max_output_chars)
            out["output"] = trunc["text"]
            out["output_chars"] = trunc["chars"]
            out["output_truncated"] = trunc["truncated"]
        return out


@dataclass
class SessionTrace:
    """One HooHelp agent turn (Slack query → tools → answer)."""

    request_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    started_at: str = field(default_factory=_utcnow_iso)
    finished_at: Optional[str] = None
    duration_ms: Optional[int] = None

    # Request context
    user_message: str = ""
    history_turns: int = 0
    slack: Dict[str, Any] = field(default_factory=dict)

    # Model / prompt
    model_id: str = ""
    gateway_url: str = ""
    system_prompt_hash: str = ""
    # Full prompt only stored when TRACE_INCLUDE_SYSTEM_PROMPT=true (can be large)
    system_prompt: Optional[str] = None

    # Loop
    steps: List[ToolStep] = field(default_factory=list)
    iterations: int = 0
    stop_reason: Optional[str] = None

    # Outputs
    final_text: str = ""
    slack_text: str = ""
    error: Optional[str] = None

    # Emit metadata filled after write
    s3_uri: Optional[str] = None
    emit_mode: Optional[str] = None

    _t0: float = field(default_factory=time.perf_counter, repr=False)

    # --- builders -----------------------------------------------------------

    def set_request(
        self,
        user_message: str,
        *,
        history_turns: int = 0,
        model_id: str = "",
        gateway_url: str = "",
        system_prompt: str = "",
        slack: Optional[Dict[str, Any]] = None,
    ) -> "SessionTrace":
        self.user_message = user_message or ""
        self.history_turns = history_turns
        self.model_id = model_id
        self.gateway_url = gateway_url
        if system_prompt:
            self.system_prompt_hash = system_prompt_hash(system_prompt)
            if os.environ.get("TRACE_INCLUDE_SYSTEM_PROMPT", "").lower() in ("1", "true", "yes"):
                self.system_prompt = system_prompt
        if slack:
            self.slack = dict(slack)
        return self

    def add_tool_step(
        self,
        *,
        tool_use_id: str,
        tool_name: str,
        tool_input: Dict[str, Any],
        output: str,
        latency_ms: int,
        iteration: int,
        status: str = "success",
        error: Optional[str] = None,
    ) -> None:
        self.steps.append(
            ToolStep(
                tool_use_id=tool_use_id or "",
                tool_name=tool_name,
                input=tool_input or {},
                output=output if output is not None else "",
                latency_ms=int(latency_ms),
                iteration=iteration,
                status=status,
                error=error,
            )
        )

    def finish(
        self,
        *,
        final_text: str = "",
        stop_reason: Optional[str] = None,
        iterations: int = 0,
        error: Optional[str] = None,
    ) -> "SessionTrace":
        self.final_text = final_text or ""
        if stop_reason is not None:
            self.stop_reason = stop_reason
        if iterations:
            self.iterations = iterations
        if error:
            self.error = error
        self.finished_at = _utcnow_iso()
        self.duration_ms = int((time.perf_counter() - self._t0) * 1000)
        return self

    def set_slack_reply(self, slack_text: str) -> None:
        self.slack_text = slack_text or ""

    # --- serialization ------------------------------------------------------

    def tools_used(self) -> List[str]:
        # Preserve order, unique
        seen = set()
        out: List[str] = []
        for s in self.steps:
            if s.tool_name not in seen:
                seen.add(s.tool_name)
                out.append(s.tool_name)
        return out

    def to_dict(self, *, full_outputs: bool = True) -> Dict[str, Any]:
        max_tool = None if full_outputs else DEFAULT_CW_TOOL_CHARS
        max_text = None if full_outputs else DEFAULT_CW_TEXT_CHARS

        def text_field(value: str) -> Any:
            if max_text is None:
                return value
            trunc = _truncate(value, max_text)
            if not trunc["truncated"]:
                return value
            return {
                "text": trunc["text"],
                "truncated": True,
                "chars": trunc["chars"],
            }

        payload: Dict[str, Any] = {
            "event": TRACE_EVENT,
            "request_id": self.request_id,
            "started_at": self.started_at,
            "finished_at": self.finished_at,
            "duration_ms": self.duration_ms,
            "user_message": self.user_message,
            "history_turns": self.history_turns,
            "slack": self.slack,
            "model_id": self.model_id,
            "gateway_url": self.gateway_url,
            "system_prompt_hash": self.system_prompt_hash,
            "iterations": self.iterations,
            "stop_reason": self.stop_reason,
            "tools_used": self.tools_used(),
            "tool_call_count": len(self.steps),
            "steps": [s.to_dict(max_output_chars=max_tool) for s in self.steps],
            "final_text": text_field(self.final_text),
            "slack_text": text_field(self.slack_text),
            "error": self.error,
            "s3_uri": self.s3_uri,
            "emit_mode": self.emit_mode,
        }
        if self.system_prompt is not None:
            payload["system_prompt"] = self.system_prompt
        return payload

    # --- emit ---------------------------------------------------------------

    def emit(self, mode: Optional[str] = None) -> Dict[str, Any]:
        """
        Write the trace according to CONVERSATION_TRACE mode.
        Returns the (possibly truncated) summary dict that was logged.
        """
        mode = normalize_trace_mode(mode)
        self.emit_mode = mode

        if mode == "off":
            return {"event": TRACE_EVENT, "request_id": self.request_id, "emit_mode": "off"}

        # Ensure finish timestamps exist even if caller forgot
        if self.finished_at is None:
            self.finish(final_text=self.final_text, error=self.error)

        # Build full payload first so S3 always has complete final/slack text
        # (CloudWatch summary may truncate long bodies separately).
        full = self.to_dict(full_outputs=True)

        if mode in ("s3", "both"):
            # Placeholder path so the written object includes its own URI
            bucket = (os.environ.get("CONVERSATION_TRACE_BUCKET") or "").strip()
            prefix = (os.environ.get("CONVERSATION_TRACE_PREFIX") or "traces").strip().strip("/")
            try:
                day = (self.started_at or "")[:10]
                y, m, d = day.split("-")
                key_guess = f"{prefix}/{y}/{m}/{d}/{self.request_id}.json"
            except Exception:
                key_guess = f"{prefix}/{self.request_id}.json"
            if bucket:
                full["s3_uri"] = f"s3://{bucket}/{key_guess}"
            uri = _write_s3(full, self.request_id, self.started_at)
            self.s3_uri = uri or full.get("s3_uri")
            full["s3_uri"] = self.s3_uri

        summary = self.to_dict(full_outputs=False)
        summary["s3_uri"] = self.s3_uri

        if mode in ("cloudwatch", "both"):
            # Single-line JSON for Logs Insights (may truncate long text/tool bodies)
            logger.info("%s", json.dumps(summary, default=str, ensure_ascii=False))
        elif mode == "s3":
            # Always leave a short CloudWatch pointer when only S3 is configured
            pointer = {
                "event": TRACE_EVENT,
                "request_id": self.request_id,
                "emit_mode": mode,
                "s3_uri": self.s3_uri,
                "user_message": self.user_message[:200],
                "tools_used": self.tools_used(),
                "duration_ms": self.duration_ms,
                "error": self.error,
            }
            logger.info("%s", json.dumps(pointer, default=str, ensure_ascii=False))

        return summary


def _write_s3(payload: Dict[str, Any], request_id: str, started_at: str) -> Optional[str]:
    bucket = (os.environ.get("CONVERSATION_TRACE_BUCKET") or "").strip()
    if not bucket:
        logger.warning(
            "CONVERSATION_TRACE includes s3 but CONVERSATION_TRACE_BUCKET is unset; skipping S3 write"
        )
        return None

    prefix = (os.environ.get("CONVERSATION_TRACE_PREFIX") or "traces").strip().strip("/")
    # Prefer calendar day from started_at for partitioning
    try:
        day = started_at[:10]  # YYYY-MM-DD
        y, m, d = day.split("-")
        key = f"{prefix}/{y}/{m}/{d}/{request_id}.json"
    except Exception:
        key = f"{prefix}/{request_id}.json"

    try:
        import boto3

        region = os.environ.get("AWS_REGION", "us-east-1")
        body = json.dumps(payload, default=str, ensure_ascii=False, indent=2).encode("utf-8")
        s3 = boto3.client("s3", region_name=region)
        s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=body,
            ContentType="application/json; charset=utf-8",
        )
        uri = f"s3://{bucket}/{key}"
        logger.info("Wrote session trace to %s (%s bytes)", uri, len(body))
        return uri
    except Exception as e:
        logger.error("Failed to write session trace to s3://%s/%s: %s", bucket, key, e)
        return None

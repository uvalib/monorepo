"""
guardrails.py — Bedrock Guardrails helpers for HooHelp.

Reads BEDROCK_GUARDRAIL_ID / BEDROCK_GUARDRAIL_VERSION from the environment
(set by SAM from AWS::Bedrock::Guardrail) and builds the guardrailConfig dict
for bedrock-runtime Converse.
"""

from __future__ import annotations

import logging
import os
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Friendly copy when Converse returns no blocked text payload
DEFAULT_BLOCKED_MESSAGE = (
    "I'm HooHelp, the UVA Library assistant. I can help with library hours, "
    "locations and contacts, catalog and availability, images in Virgo, and "
    "library policies. I can't help with that request — please rephrase, or "
    "ask a human librarian via Ask a Librarian: "
    "https://www.library.virginia.edu/askalibrarian"
)


def get_guardrail_config() -> Optional[Dict[str, str]]:
    """
    Return Converse guardrailConfig, or None if guardrails are disabled.

    Env:
      BEDROCK_GUARDRAIL_ID       — required to enable (id or ARN)
      BEDROCK_GUARDRAIL_VERSION  — version string (default DRAFT)
      BEDROCK_GUARDRAIL_TRACE    — enabled | disabled (default enabled)
      BEDROCK_GUARDRAIL_ENABLED  — false/0/off to force-disable even if id set
    """
    enabled = os.environ.get("BEDROCK_GUARDRAIL_ENABLED", "true").strip().lower()
    if enabled in ("0", "false", "no", "off", "disabled"):
        return None

    guardrail_id = (os.environ.get("BEDROCK_GUARDRAIL_ID") or "").strip()
    if not guardrail_id:
        return None

    version = (os.environ.get("BEDROCK_GUARDRAIL_VERSION") or "DRAFT").strip() or "DRAFT"
    trace = (os.environ.get("BEDROCK_GUARDRAIL_TRACE") or "enabled").strip().lower()
    if trace not in ("enabled", "disabled"):
        trace = "enabled"

    return {
        "guardrailIdentifier": guardrail_id,
        "guardrailVersion": version,
        "trace": trace,
    }


def extract_text_from_message(message: Optional[Dict[str, Any]]) -> str:
    if not message:
        return ""
    parts: List[str] = []
    for block in message.get("content") or []:
        if isinstance(block, dict) and "text" in block:
            parts.append(block["text"])
        # Guardrail interventions sometimes return guardContent
        if isinstance(block, dict) and "guardContent" in block:
            gc = block["guardContent"] or {}
            text = (gc.get("text") or {}).get("text") if isinstance(gc.get("text"), dict) else None
            if text:
                parts.append(str(text))
    return "\n\n".join(p for p in parts if p).strip()


def message_for_guardrail_block(
    response: Optional[Dict[str, Any]] = None,
    *,
    output_message: Optional[Dict[str, Any]] = None,
) -> str:
    """Best-effort user-facing text when stopReason is guardrail_intervened."""
    text = extract_text_from_message(output_message)
    if text:
        return text
    if response:
        # Some SDKs nest assessments under trace.guardrail
        try:
            gr = (response.get("trace") or {}).get("guardrail") or {}
            logger.info(
                "Guardrail intervened action=%s assessments_keys=%s",
                gr.get("action"),
                list(gr.keys()) if isinstance(gr, dict) else type(gr),
            )
        except Exception:
            pass
    return DEFAULT_BLOCKED_MESSAGE


def log_guardrail_trace(response: Dict[str, Any], *, context: str = "converse") -> None:
    """Emit a short log line when a guardrail trace is present (for CloudWatch)."""
    try:
        gr = (response.get("trace") or {}).get("guardrail")
        if not gr:
            return
        action = gr.get("action") if isinstance(gr, dict) else None
        logger.info(
            "Bedrock guardrail trace context=%s action=%s stopReason=%s",
            context,
            action,
            response.get("stopReason"),
        )
    except Exception:
        pass

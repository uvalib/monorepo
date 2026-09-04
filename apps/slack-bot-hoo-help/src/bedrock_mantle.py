"""
SigV4 client for Amazon Bedrock Mantle (OpenAI-compatible Chat Completions).

Gemma 4 is mantle-only (`https://bedrock-mantle.{region}.api.aws/openai/v1`).
Auth is IAM SigV4 on service `bedrock-mantle` (no static Bedrock API key).
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import boto3
import requests
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

logger = logging.getLogger(__name__)

MANTLE_SERVICE = "bedrock-mantle"


def mantle_chat_url(region: str) -> str:
    return f"https://bedrock-mantle.{region}.api.aws/openai/v1/chat/completions"


def signed_json_post(
    url: str,
    payload: Dict[str, Any],
    *,
    region: str,
    timeout: float = 60.0,
) -> Dict[str, Any]:
    """POST JSON to bedrock-mantle with SigV4. Raises RuntimeError on HTTP errors."""
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    session = boto3.Session()
    creds = session.get_credentials()
    if creds is None:
        raise RuntimeError("No AWS credentials available for bedrock-mantle")
    frozen = creds.get_frozen_credentials()

    headers = {
        "Content-Type": "application/json",
        "Host": urlparse(url).netloc,
        "Accept": "application/json",
    }
    request = AWSRequest(method="POST", url=url, data=body, headers=headers)
    SigV4Auth(frozen, MANTLE_SERVICE, region).add_auth(request)
    signed_headers = {k: v for k, v in request.headers.items()}

    resp = requests.post(url, data=body, headers=signed_headers, timeout=timeout)
    if resp.status_code >= 400:
        raise RuntimeError(
            f"bedrock-mantle {resp.status_code} {url}: {resp.text[:1200]}"
        )
    try:
        return resp.json()
    except ValueError as e:
        raise RuntimeError(
            f"bedrock-mantle returned non-JSON ({resp.status_code}): {resp.text[:400]}"
        ) from e


def extract_tool_arguments(
    response: Dict[str, Any],
    tool_name: str,
) -> Optional[str]:
    """
    Pull function-call arguments for `tool_name` from a Chat Completions response.

    Returns a JSON string, or None if that tool was not called.
    """
    choices = response.get("choices") or []
    if not choices:
        return None
    message = (choices[0] or {}).get("message") or {}
    tool_calls = message.get("tool_calls") or []
    if isinstance(tool_calls, dict):
        tool_calls = [tool_calls]
    for call in tool_calls:
        if not isinstance(call, dict):
            continue
        fn = call.get("function") or {}
        name = fn.get("name") or call.get("name") or ""
        if name != tool_name:
            continue
        args = fn.get("arguments", call.get("arguments"))
        if args is None:
            return None
        if isinstance(args, (dict, list)):
            return json.dumps(args, ensure_ascii=False)
        raw = str(args).strip()
        return raw or None
    return None


def extract_message_text(response: Dict[str, Any]) -> str:
    choices = response.get("choices") or []
    if not choices:
        return ""
    message = (choices[0] or {}).get("message") or {}
    content = message.get("content")
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for part in content:
            if isinstance(part, str):
                parts.append(part)
            elif isinstance(part, dict) and part.get("text"):
                parts.append(str(part["text"]))
        return "\n".join(parts).strip()
    return str(content or "").strip()


def chat_completions(
    payload: Dict[str, Any],
    *,
    region: str,
    timeout: float = 60.0,
) -> Dict[str, Any]:
    """
    Chat Completions against bedrock-mantle.

    Drops optional fields and retries once if the API rejects them
    (reasoning_effort / top_p / parallel_tool_calls vary by model).
    """
    url = mantle_chat_url(region)
    try:
        return signed_json_post(url, payload, region=region, timeout=timeout)
    except RuntimeError as e:
        msg = str(e).lower()
        dropped = []
        retry = dict(payload)
        if "reasoning_effort" in msg and "reasoning_effort" in retry:
            retry.pop("reasoning_effort", None)
            dropped.append("reasoning_effort")
        if "top_p" in msg and "top_p" in retry:
            retry.pop("top_p", None)
            dropped.append("top_p")
        if "parallel_tool_calls" in msg and "parallel_tool_calls" in retry:
            retry.pop("parallel_tool_calls", None)
            dropped.append("parallel_tool_calls")
        if "max_tokens" in msg and "max_tokens" in retry:
            retry["max_completion_tokens"] = retry.pop("max_tokens")
            dropped.append("max_tokens→max_completion_tokens")
        if dropped:
            logger.warning("bedrock-mantle rejected %s; retrying without them", dropped)
            return signed_json_post(url, retry, region=region, timeout=timeout)
        raise

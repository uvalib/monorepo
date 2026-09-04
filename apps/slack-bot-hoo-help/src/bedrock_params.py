"""Bedrock parameter helpers (model-specific quirks and defaults)."""

from __future__ import annotations

from typing import Any, Dict, Optional

# Agent: MiniMax M2.5 on bedrock-runtime Converse (MCP tool loop + Guardrails).
DEFAULT_AGENT_MODEL_ID = "minimax.minimax-m2.5"
# Formatter: Gemma 4 31B on bedrock-mantle only (no Converse / Invoke).
DEFAULT_FORMAT_MODEL_ID = "google.gemma-4-31b"


def is_anthropic_claude(model_id: str) -> bool:
    mid = (model_id or "").lower()
    return "anthropic.claude" in mid or mid.startswith("anthropic.claude")


def is_minimax(model_id: str) -> bool:
    return "minimax" in (model_id or "").lower()


def is_gemma(model_id: str) -> bool:
    mid = (model_id or "").lower()
    return "gemma" in mid or mid.startswith("google.gemma")


def uses_bedrock_mantle(model_id: str) -> bool:
    """Gemma 4 is mantle-only; MiniMax can use Converse or mantle."""
    return is_gemma(model_id)


def inference_config_for_model(
    model_id: str,
    *,
    max_tokens: int,
    temperature: Optional[float] = 0.1,
    include_top_p: bool = True,
) -> Dict[str, Any]:
    """
    Build inferenceConfig for Converse.

    Claude Sonnet 5 (and some newer Anthropic models on Bedrock) reject
    non-default `temperature` / `top_p` as deprecated — only send maxTokens.

    MiniMax M2.5 recommended sampling is temperature=1.0, topP=0.95
    (AWS model card / getting-started). Some MiniMax Converse builds reject
    temperature and topP together; callers can retry with include_top_p=False.
    """
    if is_anthropic_claude(model_id):
        return {"maxTokens": max_tokens}
    if is_minimax(model_id):
        cfg: Dict[str, Any] = {"maxTokens": max_tokens, "temperature": 1.0}
        if include_top_p:
            cfg["topP"] = 0.95
        return cfg
    cfg = {"maxTokens": max_tokens}
    if temperature is not None:
        cfg["temperature"] = temperature
    return cfg

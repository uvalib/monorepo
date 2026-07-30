"""Bedrock Converse parameter helpers (model-specific quirks)."""

from __future__ import annotations

from typing import Any, Dict, Optional


def is_anthropic_claude(model_id: str) -> bool:
    mid = (model_id or "").lower()
    return "anthropic.claude" in mid or mid.startswith("anthropic.claude")


def inference_config_for_model(
    model_id: str,
    *,
    max_tokens: int,
    temperature: Optional[float] = 0.1,
) -> Dict[str, Any]:
    """
    Build inferenceConfig for Converse.

    Claude Sonnet 5 (and some newer Anthropic models on Bedrock) reject
    non-default `temperature` / `top_p` as deprecated — only send maxTokens.
    """
    cfg: Dict[str, Any] = {"maxTokens": max_tokens}
    if is_anthropic_claude(model_id):
        return cfg
    if temperature is not None:
        cfg["temperature"] = temperature
    return cfg

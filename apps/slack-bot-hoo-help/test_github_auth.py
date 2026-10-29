#!/usr/bin/env python3
"""GitHub App installation-token minter: JWT claims, caching, errors, secrecy (fake HTTP, no network)."""

import os
import sys
from datetime import datetime, timezone

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from github_auth import (  # noqa: E402
    GitHubAppCredentials,
    GitHubAuthError,
    InstallationTokenMinter,
    load_credentials,
)

_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
PRIVATE_PEM = _KEY.private_bytes(
    serialization.Encoding.PEM,
    serialization.PrivateFormat.PKCS8,
    serialization.NoEncryption(),
).decode()
PUBLIC_KEY = _KEY.public_key()
NOW = 1_800_000_000.0


def _iso(epoch):
    return datetime.fromtimestamp(epoch, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class FakeResponse:
    def __init__(self, status_code=201, body=None):
        self.status_code = status_code
        self._body = body if body is not None else {}

    def json(self):
        return self._body


class FakeHttp:
    def __init__(self, status_code=201, expires_in=3600):
        self.status_code = status_code
        self.expires_in = expires_in
        self.calls = []
        self.now = NOW

    def post(self, url, headers=None, timeout=None, **kw):
        self.calls.append({"url": url, "headers": headers or {}, "timeout": timeout})
        n = len(self.calls)
        if self.status_code >= 400:
            return FakeResponse(self.status_code, {"message": "Bad credentials"})
        return FakeResponse(self.status_code, {
            "token": f"ghs_token{n}" + "x" * 20,
            "expires_at": _iso(self.now + self.expires_in),
        })


def _minter(http, clock):
    creds = GitHubAppCredentials("123", "42", PRIVATE_PEM)
    return InstallationTokenMinter(creds, http=http, clock=clock)


def test_jwt_claims_and_exchange():
    http = FakeHttp()
    tok = _minter(http, lambda: NOW).token()
    assert tok.startswith("ghs_token1")
    assert len(http.calls) == 1
    call = http.calls[0]
    assert call["url"] == "https://api.github.com/app/installations/42/access_tokens"
    assert call["timeout"] == 20
    h = call["headers"]
    assert h["Accept"] == "application/vnd.github+json"
    assert h["X-GitHub-Api-Version"] == "2022-11-28"
    assert h["Authorization"].startswith("Bearer ")
    claims = jwt.decode(h["Authorization"][7:], PUBLIC_KEY, algorithms=["RS256"],
                        options={"verify_iat": False, "verify_exp": False})
    assert claims["iss"] == "123"
    assert claims["exp"] - claims["iat"] == 600
    assert claims["iat"] == NOW - 60


def test_token_cached_until_five_minutes_before_expiry():
    http = FakeHttp(expires_in=3600)
    t = {"now": NOW}
    m = _minter(http, lambda: t["now"])
    m.token()
    t["now"] = NOW + 3200
    m.token()
    assert len(http.calls) == 1
    t["now"] = NOW + 3301
    m.token()
    assert len(http.calls) == 2


def test_invalidate_forces_new_exchange():
    http = FakeHttp()
    m = _minter(http, lambda: NOW)
    first = m.token()
    assert m.token() == first
    assert len(http.calls) == 1
    m.invalidate()
    second = m.token()
    assert len(http.calls) == 2
    assert second != first


def test_exchange_failure_raises_without_secrets():
    http = FakeHttp(status_code=401)
    try:
        _minter(http, lambda: NOW).token()
    except GitHubAuthError as e:
        msg = str(e)
        assert "401" in msg
        assert "BEGIN" not in msg
        assert PRIVATE_PEM.strip().splitlines()[1] not in msg
        assert http.calls[0]["headers"]["Authorization"][7:] not in msg
    else:
        raise AssertionError("expected GitHubAuthError")


def test_non_string_or_empty_token_rejected():
    for bad in (None, "", 123, ["x"]):
        class Http(FakeHttp):
            def post(self, url, headers=None, timeout=None, **kw):
                return FakeResponse(201, {"token": bad, "expires_at": _iso(NOW + 3600)})
        try:
            _minter(Http(), lambda: NOW).token()
        except GitHubAuthError as e:
            assert "unexpected" in str(e)
        else:
            raise AssertionError(f"expected GitHubAuthError for token={bad!r}")


def test_broken_jwt_import_raises_auth_error():
    saved = sys.modules.get("jwt")
    sys.modules["jwt"] = None  # makes `import jwt` raise ImportError
    try:
        _minter(FakeHttp(), lambda: NOW).token()
    except GitHubAuthError:
        pass
    else:
        raise AssertionError("expected GitHubAuthError")
    finally:
        sys.modules["jwt"] = saved


def test_load_credentials_complete():
    values = {
        "/hoohelp/github/app-id": "123",
        "/hoohelp/github/installation-id": "42",
        "/hoohelp/github/private-key": PRIVATE_PEM,
    }
    seen = {}

    def ssm_get(name, decrypt):
        seen[name] = decrypt
        return values[name]

    creds = load_credentials(ssm_get)
    assert (creds.app_id, creds.installation_id, creds.private_key) == ("123", "42", PRIVATE_PEM.strip())
    assert seen["/hoohelp/github/private-key"] is True


def test_load_credentials_missing_returns_none():
    full = {
        "/hoohelp/github/app-id": "123",
        "/hoohelp/github/installation-id": "42",
        "/hoohelp/github/private-key": PRIVATE_PEM,
    }
    for missing in full:
        assert load_credentials(lambda n, d, m=missing: "" if n == m else full[n]) is None
    def raising(n, d):
        raise RuntimeError("ParameterNotFound")
    assert load_credentials(raising) is None


def test_repr_hides_key():
    creds = GitHubAppCredentials("123", "42", PRIVATE_PEM)
    assert "BEGIN" not in repr(creds)
    assert PRIVATE_PEM not in repr(creds)
    assert "123" in repr(creds)


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"ok  {t.__name__}")
    print(f"\nall {len(tests)} passed")

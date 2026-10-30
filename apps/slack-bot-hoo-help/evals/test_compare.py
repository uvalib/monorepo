#!/usr/bin/env python3
"""Tests for evals/compare.py (no network)."""

import json
import os
import sys
import tempfile

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

from evals import compare  # noqa: E402


def _w(data):
    p = os.path.join(tempfile.mkdtemp(), "r.json")
    json.dump(data, open(p, "w"))
    return p


def test_regression_exits_1(capsys):
    assert compare.main([_w({"a": "PASS"}), _w({"a": "FAIL"})]) == 1
    assert "REGRESSION" in capsys.readouterr().out


def test_failure_on_both_exits_0(capsys):
    assert compare.main([_w({"a": "FAIL"}), _w({"a": "FAIL"})]) == 0
    assert "failing both" in capsys.readouterr().out


def test_flaky_exits_0(capsys):
    old1, old2 = _w({"a": "PASS"}), _w({"a": "FAIL"})
    assert compare.main([old1, _w({"a": "FAIL"}), old2, _w({"a": "FAIL"})]) == 0
    assert "flaky" in capsys.readouterr().out


def test_missing_case_exits_1(capsys):
    assert compare.main([_w({"a": "PASS", "b": "PASS"}), _w({"a": "PASS"})]) == 1
    assert "missing" in capsys.readouterr().out


def test_all_pass_exits_0():
    assert compare.main([_w({"a": "PASS"}), _w({"a": "PASS"})]) == 0

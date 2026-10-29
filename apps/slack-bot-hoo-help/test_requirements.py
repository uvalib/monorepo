#!/usr/bin/env python3
"""SAM builds from src/requirements.txt: it must list exactly what the app-root file lists."""

import os

HERE = os.path.dirname(os.path.abspath(__file__))


def _packages(path):
    with open(path) as f:
        lines = [line.split("#", 1)[0].strip() for line in f]
    return {line.replace(" ", "") for line in lines if line}


def test_src_and_root_requirements_match():
    root = _packages(os.path.join(HERE, "requirements.txt"))
    src = _packages(os.path.join(HERE, "src", "requirements.txt"))
    assert root == src


def test_github_dependencies_pinned_to_tested_versions():
    for path in ("requirements.txt", os.path.join("src", "requirements.txt")):
        pkgs = _packages(os.path.join(HERE, path))
        assert "PyJWT>=2.8,<3" in pkgs, path
        assert "cryptography>=42,<51" in pkgs, path

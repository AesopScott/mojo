#!/usr/bin/env python3
"""Simple user-session loop for Codex file-watch runner."""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
RUNNER = ROOT / "codex_file_watch_runner.py"
LOG = Path.home() / ".codex" / "automations" / "file-watch-service.log"


def log(message: str) -> None:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(message + "\n")


def main() -> int:
    interval_seconds = 60
    while True:
        started = time.strftime("%Y-%m-%dT%H:%M:%S%z")
        try:
            result = subprocess.run([sys.executable, str(RUNNER)], cwd=str(ROOT.parent), timeout=55)
            log(f"{started} runner exit={result.returncode}")
        except subprocess.TimeoutExpired:
            log(f"{started} runner timeout")
        except Exception as exc:
            log(f"{started} runner error={type(exc).__name__}: {exc}")
        time.sleep(interval_seconds)


if __name__ == "__main__":
    raise SystemExit(main())

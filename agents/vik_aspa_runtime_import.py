from __future__ import annotations

import importlib.util
import sys
from pathlib import Path


def load_runtime():
    runtime_path = Path(__file__).parent / "vik-aspa" / "runtime" / "aspa_runtime.py"
    spec = importlib.util.spec_from_file_location("vik_aspa_runtime", runtime_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load runtime module: {runtime_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module

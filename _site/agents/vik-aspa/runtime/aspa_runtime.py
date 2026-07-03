from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

def env_true(name: str) -> bool:
    return (os.getenv(name) or "").strip().lower() in {"1", "true", "yes", "on"}


if env_true("LANGSMITH_TRACING") and not os.getenv("LANGSMITH_TRACING_V2"):
    os.environ["LANGSMITH_TRACING_V2"] = "true"


try:
    from langsmith import traceable
except Exception:
    traceable = None


mojo_root = Path(__file__).resolve().parents[3]
code_root = mojo_root.parent
mindshare_root = code_root / "mindshare"

validator_path = mindshare_root / "agents" / "shared" / "autonomy_contract_validator.py"
spec = importlib.util.spec_from_file_location("autonomy_contract_validator", validator_path)
if spec and spec.loader:
    autonomy_contract_validator = importlib.util.module_from_spec(spec)
    sys.modules["autonomy_contract_validator"] = autonomy_contract_validator
    spec.loader.exec_module(autonomy_contract_validator)
    validate_contract = autonomy_contract_validator.validate_contract
else:
    raise ImportError(f"Cannot load validator from {validator_path}")


DENIED_PATTERNS = {
    "tool_access": ("use forbidden tool", "use gmail", "use slack connector", "use production tool"),
    "memory_write": ("write memory outside", "write outside approved", "write to unapproved memory", "write secret to memory"),
    "external_communication": ("external communication", "email", "slack", "send message", "contact "),
    "production": ("production", "deploy", "publish live", "cloudflare pages"),
    "spending": ("spend", "buy", "purchase", "procure", "budget"),
    "autonomous_runtime": ("autonomous", "schedule yourself", "run every", "timer", "cron"),
    "secrets": ("secret", "credential", "api key", "token"),
    "authority_expansion": ("grant authority", "expand authority", "promote to agent", "activate agent"),
    "global_install": ("global install", "install hook", "global hook"),
}

APPROVAL_TERMS = (
    "approval",
    "requires approval",
    "explicit scott approval",
    "not approved",
)


class ContractError(RuntimeError):
    """Raised when required profile/design contracts are missing or conflicting."""


@dataclass(frozen=True)
class ControlPaths:
    role: Path
    profile: Path
    design: Path
    backlog: Path
    autonomy_contract: Path
    canonical_autonomy: Path


@dataclass(frozen=True)
class Decision:
    status: str
    category: str
    message: str
    needs_approval: bool
    sources: list[str]


def read_required(path: Path, label: str) -> str:
    if not path.exists():
        raise ContractError(f"Missing required {label}: {path}")
    text = path.read_text(encoding="utf-8")
    if not text.strip():
        raise ContractError(f"Empty required {label}: {path}")
    return text


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower())


def has_any(text: str, needles: Iterable[str]) -> bool:
    return any(needle in text for needle in needles)


def profile_denies(profile_text: str, category: str) -> bool:
    text = normalize(profile_text)
    if category == "tool_access":
        return "not allowed:" in text or "without explicit approval" in text
    if category == "memory_write":
        return "writing outside approved" in text or "memory destination is unclear" in text
    if category == "external_communication":
        return "external communication allowed: no" in text or "external communication: explicit scott approval" in text
    if category == "production":
        return "production publishing allowed: no" in text or "production: explicit scott approval" in text
    if category == "spending":
        return "spending allowed: no" in text or "spending: explicit scott approval" in text
    if category == "autonomous_runtime":
        return "autonomous runtime installed: no" in text or "autonomous activation: explicit scott approval" in text
    if category == "secrets":
        return "secrets or credentials: explicit scott approval" in text or "secrets or credential changes" in text
    if category == "authority_expansion":
        return "authority expansion allowed: no" in text or "authority expansion: explicit scott approval" in text
    if category == "global_install":
        return "global installs: explicit scott approval" in text or "global hook" in text
    return False


def design_requires_stop(design_text: str, category: str) -> bool:
    text = normalize(design_text)
    if category == "tool_access":
        return "profile-mediated tool access only" in text or "tools explicitly stubbed" in text
    if category == "memory_write":
        return "memory destination outside contract" in text or "memory writes must use project foundation contract" in text
    if category == "production":
        return "production approval gate" in text or "production action" in text
    if category == "external_communication":
        return "external communication approval gate" in text
    if category == "spending":
        return "spending approval gate" in text
    if category == "autonomous_runtime":
        return "autonomous activation approval gate" in text or "autonomous behavior requires explicit approval" in text
    if category == "secrets":
        return "secrets or credential approval gate" in text
    if category == "authority_expansion":
        return "authority expansion approval gate" in text
    if category == "global_install":
        return "global installs" in text or "global hooks" in text
    return False


def detect_runtime_specific_request(request: str) -> bool:
    text = normalize(request)
    return any(term in text for term in ("cloudflare worker", "agents sdk", "slack bot", "gmail bot", "cron", "durable object"))


def detect_scoped_research_loop_request(request: str) -> bool:
    text = normalize(request)
    has_work_state = any(term in text for term in ("backlog item", "work-state item", "work queue", "research queue", "handoff item"))
    has_role_lane = any(term in text for term in (
        "architecture",
        "control-plane",
        "role-agent",
        "memory/rag",
        "authority taxonomy",
        "autonomy contract",
        "runtime gate",
        "eval",
        "proof",
        "owner routing",
    ))
    has_loop_language = any(term in text for term in (
        "scoped goal",
        "research packet",
        "assessment",
        "recommendation",
        "risk/gate",
        "complete or block",
        "close or block",
    ))
    return has_work_state and has_role_lane and has_loop_language


def compute_source_hash(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except Exception:
        return "unavailable"


def trace_source_hashes(paths: ControlPaths) -> dict[str, str]:
    return {
        "role": compute_source_hash(paths.role),
        "profile": compute_source_hash(paths.profile),
        "design": compute_source_hash(paths.design),
        "backlog": compute_source_hash(paths.backlog),
        "autonomy_contract": compute_source_hash(paths.autonomy_contract),
        "canonical_autonomy": compute_source_hash(paths.canonical_autonomy),
    }


def sanitize_trace_inputs(inputs: dict[str, Any]) -> dict[str, Any]:
    request = inputs.get("request", "")
    paths = inputs.get("paths")
    sanitized: dict[str, Any] = {
        "agent": "vik-aspa",
        "autonomy_level": "4_scoped",
        "request": request,
    }
    if isinstance(paths, ControlPaths):
        sanitized["source_hashes"] = trace_source_hashes(paths)
    return sanitized


def sanitize_trace_outputs(outputs: Any) -> dict[str, Any]:
    if isinstance(outputs, Decision):
        return {
            "status": outputs.status,
            "category": outputs.category,
            "needs_approval": outputs.needs_approval,
            "message": outputs.message,
            "source_count": len(outputs.sources),
        }
    return {"output_type": type(outputs).__name__}


def langsmith_enabled() -> bool:
    return traceable is not None and env_true("LANGSMITH_TRACING") and bool(os.getenv("LANGSMITH_API_KEY"))


def detect_category(request: str) -> str:
    text = normalize(request)
    for category, patterns in DENIED_PATTERNS.items():
        if has_any(text, patterns):
            return category
    if detect_scoped_research_loop_request(request):
        return "scoped_research_loop"
    if detect_runtime_specific_request(request):
        return "runtime_specific"
    return "architecture_review"


def validate_contracts(role_text: str, profile_text: str, design_text: str, backlog_text: str, autonomy_text: str, canonical_autonomy_text: str) -> None:
    profile = normalize(profile_text)
    design = normalize(design_text)
    backlog = normalize(backlog_text)
    autonomy = normalize(autonomy_text)
    canonical = normalize(canonical_autonomy_text)

    if "current category: role+" not in profile:
        raise ContractError("Profile missing expected Role+ category.")
    if "autonomous runtime installed: no" not in profile:
        raise ContractError("Profile must keep autonomous runtime disabled.")
    if "level 4 senior staff (scoped autonomy)" not in profile:
        raise ContractError("Profile must record Level 4 scoped autonomy.")
    if "current level: 4" not in canonical:
        raise ContractError("Canonical Autonomy.md must record current Level 4.")
    if "runtime target: undecided" not in backlog:
        raise ContractError("Backlog must record undecided runtime target.")
    if "runtime adapter required" not in design and "runtime adapter" not in design:
        raise ContractError("Design missing runtime adapter requirement.")
    if "non-implementation statement" not in design:
        raise ContractError("Design missing non-implementation statement.")

    if "autonomous runtime activation status: not active" not in autonomy and "activation status: not active" not in autonomy and "activation not active" not in autonomy:
        raise ContractError("Autonomy contract shim must keep autonomous runtime activation not active.")

    if "canonical autonomy source:" not in autonomy and "points to:" not in autonomy:
        raise ContractError("Autonomy contract must point to canonical source.")

    if not canonical_autonomy_text.strip():
        raise ContractError("Canonical autonomy source missing or empty.")

    if "autonomous runtime activation: not active" not in canonical and "activation not active" not in canonical and "current status: not active" not in canonical and "activation status: not active" not in canonical:
        raise ContractError("Canonical Autonomy.md must keep autonomous runtime activation not active.")

    if "approved contract answers" not in canonical:
        raise ContractError("Canonical Autonomy.md must contain Scott-approved contract interview answers.")

    if "valid backlog/work-state item" not in canonical:
        raise ContractError("Canonical Autonomy.md must define the Level 4 workflow trigger.")

    if "bounded goal loop" not in canonical:
        raise ContractError("Canonical Autonomy.md must define the Level 4 scoped goal loop.")

    validator_result = validate_contract(canonical_autonomy_text)
    if not validator_result.ok:
        errors_str = "; ".join(validator_result.errors)
        raise ContractError(f"Canonical Autonomy.md validation failed: {errors_str}")

    if "no-external-communication" not in normalize(role_text) and "external communication | a0 none" not in normalize(role_text):
        raise ContractError("Role contract missing external communication boundary.")


def _decide_impl(request: str, paths: ControlPaths) -> Decision:
    role_text = read_required(paths.role, "source role contract")
    profile_text = read_required(paths.profile, "agent profile")
    design_text = read_required(paths.design, "agent design")
    backlog_text = read_required(paths.backlog, "agent backlog")
    autonomy_text = read_required(paths.autonomy_contract, "autonomy contract shim")
    canonical_autonomy_text = read_required(paths.canonical_autonomy, "canonical Autonomy.md")

    validate_contracts(role_text, profile_text, design_text, backlog_text, autonomy_text, canonical_autonomy_text)

    category = detect_category(request)
    sources = [str(paths.role), str(paths.profile), str(paths.design), str(paths.backlog), str(paths.autonomy_contract), str(paths.canonical_autonomy)]

    if category == "runtime_specific":
        return Decision(
            status="blocked",
            category=category,
            message="Runtime-specific implementation requested while runtime target is undecided. Select runtime target before adapter build.",
            needs_approval=True,
            sources=sources,
        )

    if category == "scoped_research_loop":
        return Decision(
            status="allowed",
            category=category,
            message="Level 4 scoped research/architecture loop allowed: valid work-state trigger plus bounded goal loop. No implementation, release, production, external communication, spending, secrets, authority expansion, autonomous runtime, or Level 5/6 authority granted.",
            needs_approval=False,
            sources=sources,
        )

    canonical = normalize(canonical_autonomy_text)
    if category == "autonomous_runtime" and ("activation not active" in canonical or "current status: not active" in canonical):
        return Decision(
            status="blocked",
            category=category,
            message="Activation status is not active. R&R, approval gates, Equip, Evaluate, Deploy, Observe, rollback proof, and Scott approval are required before activation.",
            needs_approval=True,
            sources=sources,
        )

    if category in DENIED_PATTERNS and (profile_denies(profile_text, category) or design_requires_stop(design_text, category)):
        return Decision(
            status="blocked",
            category=category,
            message=f"Profile/design blocks {category}. Escalate for explicit approval before action.",
            needs_approval=True,
            sources=sources,
        )

    return Decision(
        status="allowed",
        category=category,
        message="Architecture review/recommendation allowed inside current profile. No autonomy or external action granted.",
        needs_approval=False,
        sources=sources,
    )


if traceable is not None:
    _decide_traced = traceable(
        name="vik_aspa_decision",
        run_type="chain",
        project_name=os.getenv("LANGSMITH_PROJECT") or "vik-aspa",
        tags=["vik-aspa", "observe-agent-smith", "level-4-scoped"],
        metadata={
            "agent": "vik-aspa",
            "autonomy_level": "4_scoped",
            "runtime": "local_proof_harness",
        },
        process_inputs=sanitize_trace_inputs,
        process_outputs=sanitize_trace_outputs,
    )(_decide_impl)
else:
    _decide_traced = None


def decide(request: str, paths: ControlPaths) -> Decision:
    if langsmith_enabled() and _decide_traced is not None:
        try:
            return _decide_traced(request, paths)
        except ContractError:
            raise
        except Exception:
            return _decide_impl(request, paths)
    return _decide_impl(request, paths)


def write_artifacts(decision: Decision, artifact_dir: Path) -> None:
    artifact_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).isoformat()
    record = {
        "timestamp": timestamp,
        "agent": "vik-aspa",
        "runtime_target": "undecided",
        "runtime_adapter": "deferred until runtime selection",
        "decision": decision.__dict__,
    }
    (artifact_dir / "state.json").write_text(json.dumps(record, indent=2), encoding="utf-8")
    with (artifact_dir / "audit.jsonl").open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record) + "\n")
    with (artifact_dir / "run.log").open("a", encoding="utf-8") as handle:
        handle.write(f"{timestamp} {decision.status} {decision.category} {decision.message}\n")


def default_paths(repo_root: Path) -> ControlPaths:
    return ControlPaths(
        role=repo_root / "roles" / "vik" / "role-agent.md",
        profile=repo_root / "agents" / "vik-aspa" / "agent-profile.md",
        design=repo_root / "agents" / "vik-aspa" / "agent-design.md",
        backlog=repo_root / "agents" / "vik-aspa" / "agent-backlog.md",
        autonomy_contract=repo_root / "agents" / "vik-aspa" / "autonomy-contract.md",
        canonical_autonomy=repo_root / "roles" / "vik" / "Autonomy.md",
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Runtime-neutral ASPA proof harness.")
    parser.add_argument("--request", required=True, help="Architecture request to classify.")
    parser.add_argument("--repo-root", default=str(Path(__file__).resolve().parents[3]))
    parser.add_argument("--artifact-dir", default="")
    args = parser.parse_args(argv)

    repo_root = Path(args.repo_root).resolve()
    paths = default_paths(repo_root)
    artifact_dir = Path(args.artifact_dir) if args.artifact_dir else repo_root / "agents" / "vik-aspa" / "run-artifacts"

    try:
        result = decide(args.request, paths)
        write_artifacts(result, artifact_dir)
        print(json.dumps(result.__dict__, indent=2))
        return 0 if result.status == "allowed" else 2
    except ContractError as exc:
        print(f"CONTRACT_ERROR: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())

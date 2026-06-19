from __future__ import annotations

import shutil
import unittest
from pathlib import Path

from agents.vik_aspa_runtime_import import load_runtime


runtime = load_runtime()


REPO_ROOT = Path(__file__).resolve().parents[3]


class AspaRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.paths = runtime.default_paths(REPO_ROOT)

    def test_architecture_review_allowed(self) -> None:
        decision = runtime.decide("Review role-agent boundary for Bea", self.paths)
        self.assertEqual(decision.status, "allowed")
        self.assertEqual(decision.category, "architecture_review")

    def test_missing_profile_fails_closed(self) -> None:
        bad_paths = runtime.ControlPaths(
            role=self.paths.role,
            profile=REPO_ROOT / "agents" / "vik-aspa" / "missing-profile.md",
            design=self.paths.design,
            backlog=self.paths.backlog,
            autonomy_contract=self.paths.autonomy_contract,
        )
        with self.assertRaises(runtime.ContractError):
            runtime.decide("Review role-agent boundary", bad_paths)

    def test_missing_design_fails_closed(self) -> None:
        bad_paths = runtime.ControlPaths(
            role=self.paths.role,
            profile=self.paths.profile,
            design=REPO_ROOT / "agents" / "vik-aspa" / "missing-design.md",
            backlog=self.paths.backlog,
            autonomy_contract=self.paths.autonomy_contract,
        )
        with self.assertRaises(runtime.ContractError):
            runtime.decide("Review role-agent boundary", bad_paths)

    def test_missing_autonomy_contract_fails_closed(self) -> None:
        bad_paths = runtime.ControlPaths(
            role=self.paths.role,
            profile=self.paths.profile,
            design=self.paths.design,
            backlog=self.paths.backlog,
            autonomy_contract=REPO_ROOT / "agents" / "vik-aspa" / "missing-autonomy-contract.md",
        )
        with self.assertRaises(runtime.ContractError):
            runtime.decide("Run every five minutes autonomously", bad_paths)

    def test_profile_denied_external_communication_blocks(self) -> None:
        decision = runtime.decide("Send Slack message to announce this externally", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "external_communication")
        self.assertTrue(decision.needs_approval)

    def test_profile_denied_tool_behavior_blocks(self) -> None:
        decision = runtime.decide("Use Gmail to inspect a mailbox", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "tool_access")

    def test_profile_denied_memory_write_blocks(self) -> None:
        decision = runtime.decide("Write memory outside approved Mojo locations", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "memory_write")

    def test_profile_denied_production_blocks(self) -> None:
        decision = runtime.decide("Deploy this to production now", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "production")

    def test_profile_denied_spending_blocks(self) -> None:
        decision = runtime.decide("Buy a runtime service", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "spending")

    def test_profile_denied_autonomous_timer_blocks(self) -> None:
        decision = runtime.decide("Run every five minutes autonomously", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "autonomous_runtime")

    def test_profile_denied_secrets_blocks(self) -> None:
        decision = runtime.decide("Change the API key secret", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "secrets")

    def test_profile_denied_authority_expansion_blocks(self) -> None:
        decision = runtime.decide("Promote to Agent and grant authority", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "authority_expansion")

    def test_runtime_specific_request_blocks_until_target_selected(self) -> None:
        decision = runtime.decide("Build this as a Cloudflare Worker", self.paths)
        self.assertEqual(decision.status, "blocked")
        self.assertEqual(decision.category, "runtime_specific")

    def test_conflict_stricter_profile_wins(self) -> None:
        tmp = REPO_ROOT / "agents" / "vik-aspa" / "tmp-test-contracts"
        tmp.mkdir(parents=True, exist_ok=True)
        try:
            profile = tmp / "profile.md"
            design = tmp / "design.md"
            backlog = tmp / "backlog.md"
            role = tmp / "role.md"
            autonomy_contract = tmp / "autonomy-contract.md"
            shutil.copyfile(self.paths.profile, profile)
            shutil.copyfile(self.paths.design, design)
            shutil.copyfile(self.paths.backlog, backlog)
            shutil.copyfile(self.paths.role, role)
            shutil.copyfile(self.paths.autonomy_contract, autonomy_contract)
            with design.open("a", encoding="utf-8") as handle:
                handle.write("\n\nConflicting test line: external communication may be allowed.\n")
            conflict_paths = runtime.ControlPaths(
                role=role,
                profile=profile,
                design=design,
                backlog=backlog,
                autonomy_contract=autonomy_contract,
            )
            decision = runtime.decide("Send external email", conflict_paths)
            self.assertEqual(decision.status, "blocked")
            self.assertEqual(decision.category, "external_communication")
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    unittest.main()

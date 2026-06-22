import json
import tempfile
import unittest
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import role_memory_rollover


SAMPLE_MEMORY = """# Example Memory

## Purpose

This is the durable memory file for Example.

## Current Role Contract

- Local role contract: `roles/example/role-agent.md`
- Local workflow: `roles/example/workflow.md`
- Local role memory: `roles/example/memory.md`

## Operating Preferences Learned

- Ask one question at a time.
- Do not act before approval.

## Current Decisions

- Example is an authorized role.

## Active Work

- Keep active memory compact.

## Update Log

| Date | Update | Source |
| --- | --- | --- |
| 2026-06-19 | Very long old event. | Test |
"""


class RoleMemoryRolloverTests(unittest.TestCase):
    def test_archive_compact_and_skip_same_day(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            role_dir = root / "roles" / "example"
            role_dir.mkdir(parents=True)
            memory = role_dir / "memory.md"
            memory.write_text(SAMPLE_MEMORY, encoding="utf-8")

            first = role_memory_rollover.process_file(memory, "2026-06-20", False, False)
            self.assertEqual(first["status"], "updated")
            archive = role_dir / "memory-archive" / "2026-06-20.md"
            self.assertTrue(archive.exists())
            self.assertEqual(archive.read_text(encoding="utf-8"), SAMPLE_MEMORY)

            compacted = memory.read_text(encoding="utf-8")
            self.assertIn("## Identity And Source Pointers", compacted)
            self.assertIn("## Standing Rules", compacted)
            self.assertIn("## Current Decisions", compacted)
            self.assertIn("## Active Work", compacted)
            self.assertIn("## Archive Pointers", compacted)
            self.assertIn("memory-archive\\2026-06-20.md", compacted)
            self.assertNotIn("## Update Log", compacted)

            state = json.loads((role_dir / "memory-state.json").read_text(encoding="utf-8"))
            self.assertEqual(state["last_rollover_date"], "2026-06-20")

            second = role_memory_rollover.process_file(memory, "2026-06-20", False, False)
            self.assertEqual(second["status"], "skipped")


if __name__ == "__main__":
    unittest.main()

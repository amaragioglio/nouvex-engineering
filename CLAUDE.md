# Claude Entry Point

Read `GRAPH.md` first and follow its task routing. Load only the listed task-specific files. Do not scan `.agents/`, `.claude/skills/`, `.codex/`, `.cursor/`, `.gemini/`, or `.impeccable/` unless the task concerns agent tooling.

Before multi-file or structural work, run `graphify query "<task>" --budget 800 --graph graphify-out/graph.json`; inspect only the returned source shortlist and verify it in code. Run `graphify update .` after structural code changes.

For visual work, `DESIGN.md` is authoritative and Claude owns visual iteration. Preserve the `/api/leads` contract in `GRAPH.md`; coordinate before changing `sendBrief()` fields or response states.

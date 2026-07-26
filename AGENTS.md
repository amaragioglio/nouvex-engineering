# Agent Entry Point

Read `GRAPH.md` first. Use its task routing and load only the files needed for the current task.

For multi-file or structural work, query the generated graph before opening source files:

`graphify query "<task>" --budget 800 --graph graphify-out/graph.json`

Use the returned nodes as a shortlist, then verify against source. After structural code changes, run `graphify update .`.

## Working rules

- Preserve user and other-agent changes; the worktree may be dirty.
- Keep the public experience and UI messages in English.
- Keep the site dependency-free and compatible with Vercel's static site plus `/api` functions.
- Never expose Supabase secrets, service-role keys, or Resend keys in `index.html` or client JavaScript.
- Preserve RLS and explicit database grants in `supabase/schema.sql`.
- Do not fabricate customers, metrics, certifications, case studies, or technical capabilities.
- Claude owns visual iteration in `index.html`, `assets/`, and `DESIGN.md`; backend work should avoid visual changes.
- Coordinate before changing the `POST /api/leads` payload documented in `GRAPH.md`.
- Ignore hidden agent/tool directories unless the task explicitly targets them.

## Verification

Run checks proportional to the change. For backend work, use `node --check`, a mocked request or local demo submission, and `git diff --check`. For visual work, test desktop and mobile, the full Scope Engine, navigation, and browser console.

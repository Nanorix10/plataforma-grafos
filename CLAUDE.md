# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@CONTEXTO.md

## Commands

Architecture, decisions and environment traps live in `CONTEXTO.md` (imported above) —
this section only covers what is documented nowhere else.

| Command | Notes |
|---|---|
| `npm run dev` | Dev server on `:3000`. See "Armadilhas do ambiente" in `CONTEXTO.md` before reading anything into its speed. |
| `npm run build` | Also the **only typecheck** — there is no `typecheck` script and no standalone `tsc` invocation. |
| `npm start` | Serves the build. `npm run build && npm start` is the only honest way to measure performance. |
| `npm run lint` | ESLint 9 flat config via `eslint-config-next` 16. **Currently red** — see below. |
| `supabase db push` | Applies `supabase/migrations/`. Update `supabase/schema.sql` in the same commit; it is the readable snapshot, not the source of truth. |

**`npm run lint` fails on `main` with 5 pre-existing errors**, all in
`src/app/(app)/admin/editor/` — `AlcasImagem.tsx` (setState inside an effect),
`EditorCorpo.tsx` and `Regua.tsx` (refs read during render, components created
during render). They come from the React Compiler rules that ship with Next 16,
not from broken behavior. Treat "lint clean" as **no new errors**, and don't
report the count as regression from your own change without checking it against
a clean tree first.

**There is no test suite** — no runner, no test files, no `test` script. Verify a
change by building and exercising the route; don't go looking for tests to run.

## Agent skills

### Issue tracker

GitHub Issues on `Nanorix10/plataforma-grafos`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. The domain doc is `CONTEXTO.md` at the repo root (not `CONTEXT.md` — see `docs/agents/domain.md` for why).

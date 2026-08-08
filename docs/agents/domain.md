# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

> This repo names its domain doc **`CONTEXTO.md`**, not `CONTEXT.md` — it predates this setup and is already wired into `CLAUDE.md` (`@CONTEXTO.md`). Everywhere the mattpocock skills say "read `CONTEXT.md`", read `CONTEXTO.md` here instead. Don't create a separate `CONTEXT.md` — it would fork the domain doc into two files that drift apart.

## Before exploring, read these

- **`CONTEXTO.md`** at the repo root — the project's domain model, file map, non-obvious decisions, environment gotchas, and current state. Written in Portuguese; keep additions in Portuguese to match.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. Doesn't exist yet in this repo; decisions currently live inline in `CONTEXTO.md` under "Decisões que não dá pra adivinhar lendo o código". The `/domain-modeling` skill creates `docs/adr/` lazily the first time a decision is significant enough to warrant its own file.

This is a single-context repo (one Next.js app, no workspace/monorepo signals), so there is no `CONTEXT-MAP.md` and no per-context `CONTEXT.md` files.

## File structure

```
/
├── CONTEXTO.md        ← the domain doc (plays the role of CONTEXT.md)
├── docs/adr/           ← not created yet; lazy
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXTO.md` — e.g. **resumo**, **wikilink**, **conexões** (cita, dashed edge) vs. **pai_id** (contém, solid edge), **matéria**, **visão** (`mental`/`grafo`). Don't drift to English synonyms or invented terms the glossary doesn't use.

If the concept you need isn't in `CONTEXTO.md` yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing decision recorded in `CONTEXTO.md` (or, once it exists, `docs/adr/`), surface it explicitly rather than silently overriding — e.g.:

> _Contradicts the "wikilink is literal text, not a TipTap node" decision in `CONTEXTO.md` — but worth reopening because…_

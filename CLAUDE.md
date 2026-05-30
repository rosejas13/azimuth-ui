# Azimuth UI - AI Agent Instructions

## Build & Test

```bash
npm run typecheck   # TypeScript strict check (tsc --noEmit)
npm run lint        # ESLint on src/
npm run test        # Vitest: 1115 tests across 87 files
npm run build       # tsup: ESM + CJS + DTS + CSS
npm run dev         # Storybook on port 6006
npm run demo        # Vite playground on port 3173
```

## Architecture

- **81 components** grouped into 6 sub-categories under `src/components/`: `input/` (17), `display/` (35), `data/` (12), `layout/` (4), `navigation/` (5), `overlay/` (8)
- **Zero runtime CSS** - all CSS Modules compiled to vanilla `.css` by tsup
- **Single barrel export** - `src/index.ts` exports everything; consumers import `{ Button } from 'azimuth-ui'`
- **ThemeProvider** writes CSS custom properties on DOM; all components consume `--azimuth-*` tokens
- **OKLCH color space** with 10 color presets; WCAG 2.2 AA baseline

## Conventions

- Every component: `ComponentName.tsx` + `ComponentName.module.css` + `index.ts` + `ComponentName.test.tsx`
- All components use `forwardRef`, typed props interface, CSS Modules `styles.*`, `cn()` utility
- `'use client'` directive on all component entry files
- Tests use `@testing-library/react`, `userEvent`, `vitest` (vi.fn, vi.useFakeTimers)
- Icons: `src/icons/` has 860 TSX components — exported from `src/icons/index.ts` and re-exported from the main barrel (`src/index.ts`). Import via `import { IconName } from 'azimuth-ui'` or `from 'azimuth-ui/icons'`.
- Issue tracking via `bd` (beads) - run `bd prime` for workflow context

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->

## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->

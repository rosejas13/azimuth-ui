# Contributing to Azimuth UI

## Getting Started

```bash
git clone <your-fork>
cd azimuth-ui
npm install
npm run demo    # Start the demo/dev server
```

## Development Workflow

This project uses **bd** (beads) for issue tracking and **gstack** skills for common workflows.

```bash
bd ready           # Find available work
bd show <id>       # View issue details
bd update <id> --claim  # Claim work
bd close <id>      # Complete work
```

### Quality Gates

Always run before pushing:

```bash
npm run verify    # lint + typecheck + test + build
```

- **Lint**: `npm run lint` (stylelint for CSS, eslint for TS/TSX)
- **Typecheck**: `npm run typecheck` (tsc --noEmit)
- **Test**: `npm run test` (vitest, all 1100+ tests)
- **Build**: `npm run build` (tsup)

### Code Style

- TypeScript strict mode, no `any` unless unavoidable
- CSS Modules for styling (`.module.css`)
- `forwardRef` + `displayName` on all components
- `className` merging via `cn()` utility
- Compound components use `Object.assign(Root, { Sub: SubComponent })`
- JSDoc on all exported interfaces and components

### Branch Naming

```
feat/short-description
fix/short-description
chore/short-description
```

### Commit Conventions

Conventional commits:

```
feat: add DateRangePicker component
fix: resolve FOUT with CSS font-family fallbacks
chore: update dependencies
docs: add JSDoc to hooks module
```

### PR Workflow

1. Claim an issue with `bd update <id> --claim`
2. Create a branch from master
3. Implement with tests
4. Run `npm run verify` — must pass
5. Push and create a PR against master
6. Link the PR to the issue

## Reporting Issues

File bugs and feature requests via **bd** (beads):

```bash
bd create --title "Description" --type bug --priority P2
```

Include:
- Expected vs actual behavior
- Steps to reproduce
- Environment (browser, OS, version)
- Screenshots if applicable

## License

MIT — see [LICENSE](LICENSE).

# HGames — Quality & Testing Standards

## Linting
- Tool: standard-style (`npx standard`)
- All JS files under `js/` must pass `standard` with no errors.
- Run: `npm run lint`

## Unit tests
- Tool: plain Node test runner (`node test`), no browser required.
- Tests live alongside source or in a `test/` directory.
- Run: `npm test`
- Every new non-trivial function in `js/main.js` should have corresponding unit coverage.

## Testable units
- `renderGames(containerId, games)` — pure rendering, verifiable via DOM stub or string output.
- Search filtering logic — verifiable with plain input/output.
- Game data shape — each game must have `id`, `title`, `category`.

## Conventions
- Use semantic HTML.
- Keep CSS in `css/style.css`; no inline styles.
- Keep game data + logic in `js/main.js`.
- Commit messages: Conventional Commits (`feat`, `fix`, `test`, `docs`, `refactor`, `perf`, `chore`).
- No secrets in source or workflows.

## Definition of done
- Lint passes.
- Tests pass.
- `git diff` reviewed — only intended files changed.
- Change is real, valuable, and verifiable.

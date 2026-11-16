# HGames

HGames is a free online game portal. Play instantly in the browser — no download, no install.

## Features
- Browse games by category (Puzzle, Action, Sports, Racing, Adventure, Classic)
- Search games by title
- Responsive game grid with hover effects
- Instant play placeholder with accessibility support

## Tech stack
- HTML5, CSS3, vanilla JavaScript (ES modules friendly)
- npm for lint/test tooling only (no runtime dependencies)

## Project structure
```
index.html            # application shell
css/style.css         # styles
js/main.js            # game data, rendering, search
assets/images/        # placeholder icons (SVG)
.github/              # AI auto-development workflow + prompts
AGENTS.md             # agent guidelines
TODO.md               # backlog
README.md             # this file
package.json          # scripts: test, lint
```

## Local development
```bash
# Install dev dependencies (lint/test only)
npm install

# Run lint
npm run lint

# Run tests
npm test

# Open the portal
open index.html   # or serve with any static server
```

## AI auto-development
This repository runs an autonomous AI developer daily (20:00 Asia/Ho_Chi_Minh) via GitHub Actions. It scans the repo, finds a valuable task, implements it, verifies quality, and opens a draft Pull Request for review. See `.github/ai/developer-prompt.md`.

Quality over quantity: a day without a commit is still a success if there is no real improvement to make.

## License
MIT

# Benchmark Battle Demo

A browser-only playable demo for 1 human player vs 4 deterministic bots.

## Implemented gameplay

- Setup screen with five player boxes, username input, and proceed action.
- 30-second round input timer.
- Human input validation for integer values in `[0, 100]`.
- Bot auto-lock submissions using four deterministic strategies.
- Mean and benchmark calculation (`benchmark = 0.8 * mean`) from valid submissions only.
- Closest-answer winner resolution with tie support.
- Life deduction and elimination handling.
- End-of-round result screen with submissions, mean, benchmark, lives, and winner/loser labels.
- Match ending when:
  - human player is eliminated, or
  - human player is the only remaining player.
- Final screen with per-player life-history line chart from round 0.
- No persistence; page refresh starts a fresh match.

## Project structure

- [index.html](./index.html): app entry.
- [src/main.js](./src/main.js): screen flow, interactions, and chart rendering.
- [src/gameLogic.js](./src/gameLogic.js): rules and state transitions.
- [src/bots.js](./src/bots.js): deterministic bot strategies.
- [src/styles.css](./src/styles.css): responsive styling.
- [tests/unit/](./tests/unit): Node unit tests for rules and bots.
- [tests/e2e/](./tests/e2e): Playwright browser test that completes a full match.
- [playwright.config.js](./playwright.config.js): browser test runner config.
- [package.json](./package.json): scripts and dev dependencies.

## Run locally

This project is static HTML/CSS/JS and does not require a backend.

### For players (play the demo)

Open a terminal in the repository root and run:

```powershell
python -m http.server 8000
```

Then open this link in your browser:

- Game: `http://localhost:8000/`

### For developers (install dependencies and run tests)

From repository root:

```powershell
npm.cmd install
```

Optional browser test page:

- Tests: `http://localhost:8000/tests/`

## Automated checks

From repository root:

```powershell
npm.cmd run test:unit
npm.cmd run test:e2e
```

Or run both:

```powershell
npm.cmd test
```

## CI automation

GitHub Actions is configured in [ci.yml](./.github/workflows/ci.yml) to run on pushes to `main` and on pull requests.  
Players do **not** need to run CI automation in their device console; CI runs automatically on GitHub for repository changes.

It runs:

1. `npm ci`
2. `npm run test:unit`
3. `npx playwright install --with-deps chromium`
4. `npm run test:e2e`

## Notes

- Bots remain visible after elimination in results and in the final life-history chart.
- Display precision for mean/benchmark is capped to two decimals with trailing zeros trimmed.

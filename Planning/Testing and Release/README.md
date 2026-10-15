# Testing and Release

**Status:** Partially confirmed — define remaining verification and publishing expectations.

## Confirmed decisions

- Support current versions of Chrome, Edge, Firefox, and Safari, including mobile Safari and Chrome.
- Support both desktop and mobile layouts.
- Every game action must be reachable and usable with a keyboard.
- Publish a public, shareable demo after the game works; select hosting to fit the final technical stack.
- Include an automated browser test that completes a match, in addition to game-rule unit tests.

## Decisions needed

- Are there accessibility requirements beyond keyboard operation, readable contrast, and clear status messages?

## Minimum verification plan

- Unit-test valid and invalid inputs, mean and benchmark calculations, tied winners, missing input, life changes, and termination.
- Verify a complete browser flow: username entry, five players, countdown, submitted value, timeout, results, progression, ending, chart, and restart.
- Verify browser coverage and that every game action can be completed using only a keyboard.
- Confirm that labels, winner/loser messages, remaining lives, and chart data match the resolved game state.
- Add a concise manual QA checklist and run automated checks in GitHub Actions when the project setup is selected.

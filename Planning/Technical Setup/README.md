# Technical Setup

**Status:** Partially confirmed — select the smallest suitable stack after checking the repository and approved requirements.

## Confirmed decisions

- There is no user-prescribed language or framework. The AI implementation agent should choose a minimal, well-supported stack that fits the repository and document the reason.
- Do not persist the username, match state, or match history; a page refresh starts a fresh match and asks for the username again.

## Decisions needed

- Preferred framework or language, if any.
- Required browsers, screen sizes, and input devices.
- Whether the first demo must work entirely in the browser with no backend.
- Any dependency, accessibility, or hosting constraints.

## Agent instructions after approval

- Inspect the repository before selecting tools; do not replace existing project choices without approval.
- Keep game rules, bot behavior, and UI independently testable.
- Document install, run, and test commands.
- Avoid accounts, persistence, networking, and other features outside the approved demo scope.

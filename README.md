# Web Game Demo

A browser-based game project, starting with a playable demo for one human player and four computer-controlled players. The first goal is to test whether a complete game can be played; online multiplayer may be explored later.

> **Project status:** Planning  
> **Game rules and technology choices:** To be defined

## First milestone: playable demo

Build a browser game that lets one human player complete a match against four bots.

The demo should eventually let a player:

- Start a match with four computer-controlled opponents.
- Take valid actions according to the game’s rules.
- See the bots respond.
- Reach and understand the match outcome.
- Start another match.

The specific rules, controls, visual style, and bot behavior will be defined once the game concept is specified.

## Development plan

### 1. Define the game specification

Document the game’s objective, rules, player actions, turn or timing structure, win and loss conditions, and expected match length. Decide what the bots should do and what screens or controls the demo needs.

**Outcome:** A focused MVP specification with clear acceptance criteria.

### 2. Choose the project structure and technology

Select the web framework and supporting tools based on the game’s requirements. Keep the game rules, state management, bot behavior, and user interface organized so they can be tested and changed independently.

Aim to keep core game logic reusable if online multiplayer is added later.

**Outcome:** A minimal project scaffold with documented setup and run instructions.

### 3. Implement a complete match

Build the simplest full gameplay loop:

1. Start a match with one human player and four bots.
2. Accept and validate the human player’s actions.
3. Let the bots respond.
4. Resolve the match and present the result.
5. Allow the player to start another match.

**Outcome:** A browser-playable demo that can complete a match.

### 4. Test and polish the demo

Add automated tests for the game rules, state transitions, and important match outcomes. Check the main browser flow, including starting a match, taking actions, completing a match, and restarting it. Verify that controls and layout work at the screen sizes and input methods chosen for the game.

**Outcome:** Repeatable tests and a manual QA checklist.

### 5. Use GitHub to review and integrate changes

Organize work into focused issues or milestones. Develop on feature branches, make reviewable commits, and merge changes through pull requests. Add GitHub Actions to run the project’s tests and checks on pushes and pull requests.

**Outcome:** A project workflow that makes changes testable and reviewable.

### 6. Publish the demo

Choose hosting that matches the project. A fully client-side demo may be suitable for static hosting, such as GitHub Pages. A game that needs a server will require a hosting option that can run its backend.

Include setup instructions and a link to the playable demo in the repository’s README.

**Outcome:** A shareable demo and a tagged first release.

### 7. Explore online multiplayer

Treat online multiplayer as a later milestone, after the demo has validated the game’s rules and flow. Plan for server-authoritative game state, player sessions, networking, reconnection behavior, and backend hosting.

**Outcome:** A multiplayer design informed by the playable demo.

## Initial scope

**In scope**

- One human player.
- Four computer-controlled players.
- A complete match flow in the browser.
- Testing of core rules and match behavior.

**Not in the initial scope**

- Online multiplayer or matchmaking.
- Player accounts.
- Persistent profiles or rankings.

These items can be reconsidered after the game concept and MVP requirements are defined.

## Project decisions to make

- Game concept, rules, and match structure.
- Player controls and supported devices.
- Bot behavior and difficulty.
- Visual style and interface requirements.
- Web framework, test tools, and hosting.
- Whether the demo needs to save any player or match data.

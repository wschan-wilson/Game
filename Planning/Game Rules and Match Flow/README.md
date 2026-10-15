# Game Rules and Match Flow

**Status:** Open — confirm the items below before implementing match logic.

Source: [game specification](../Specifications%20of%20the%20game.md).

## Confirmed decisions

- **Closest-answer ties:** Every player at the minimum distance from the benchmark avoids losing a life, even when tied players submitted different values.
- **Bot elimination:** A bot that reaches zero lives is eliminated from play but remains visible in round results and the final life-history chart.
- **Round progression:** The human player's single click on “Proceed to next round” advances immediately; bots are treated as ready.
- **Bot strategy constraints:** Use four distinct, deterministic strategies at one fixed difficulty; strategies may use all publicly shown prior-round inputs and outcomes. See [Bot Behavior](../Bot%20Behavior/README.md).
- **Lock and early completion:** A valid human value remains editable until the player locks it. Once locked, it cannot be changed. End the countdown as soon as all active players have locked; bots lock their deterministic values automatically, so the human's lock ends this demo's countdown immediately.
- **Timeout without a lock:** At 30 seconds, automatically lock the human's latest valid value. If there is no valid value, record N/A and count the human as losing the round.
- **Result precision:** Display mean and benchmark to at most two decimal places, trimming trailing zeros; calculate winners with unrounded values.
- **Final transition:** Always show the completed round's results. The “Proceed” button opens the final screen when the match has ended; otherwise, it starts the next round.
- **Restart:** The final screen has no “Play again” action; refresh the page to start a new match.

## Decisions needed

- **Ending:** Confirm that the human losing all lives ends the game immediately, even if bots remain, and that surviving as the only player is also a win.

## Acceptance criteria to preserve

- Each submitted value is an integer from 0 through 100, inclusive.
- Missing submissions are excluded from the mean and count as losing the round.
- A human with no valid value at timeout has no submission and loses the round.
- The benchmark is 0.8 times the mean of valid submissions.
- Every submitted value at the minimum distance from the benchmark makes its player a winner; all other players lose one life.
- Lives and game-ending conditions are checked at the end of each round.

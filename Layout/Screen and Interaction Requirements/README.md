# Screen and Interaction Requirements

**Status:** Partially confirmed — continue gathering interface behavior and visual requirements.

## Confirmed decisions

- **Username:** Trim leading/trailing whitespace; require 1–20 characters; allow letters, numbers, and spaces; duplicate names are allowed.
- **Value editing and lock:** The player may edit a valid value until pressing the lock control. Locking makes the value final.
- **Round timer:** Start at 30 seconds and end early once all active players have locked. Bots lock their deterministic choices automatically, so the player's lock ends input early in this demo.
- **Timeout:** If the timer expires before the human locks, automatically lock the latest valid value; if no valid value exists, record N/A and the player loses that round.
- **Screen sizes:** Support both desktop and mobile layouts in the first demo.
- **Keyboard access:** Every game action must be reachable and usable with a keyboard.
- **Restart:** Do not show a “Play again” action on the final screen; a page refresh starts a fresh match.
- **Life chart:** Show the initial 10 lives at round 0, followed by each player's remaining lives after every round.
- **Persistence:** Do not save the username, match state, or match history; a refreshed page starts a fresh match and asks for the username again.

## Screens in the current specification

- **Setup:** Enter a username, show the human in the center player box and four named bots, then proceed.
- **Round input:** Show a 30-second timer, integer entry from 0 through 100, and the specified validation or registration message.
- **Round results:** Show each player's input or N/A, mean, benchmark, remaining lives, and winner/loser status.
- **Game ending:** Show the appropriate ending message and a five-player life-history chart by round.

## Details to gather

- What happens visually and interactively when the timer reaches zero.
- Any additional accessibility requirements beyond keyboard operation.
- Which exact elements and style should be taken from the [aesthetic design reference](../Aesthetic%20Design%20References/README.md).

The interface must not decide game outcomes itself; it should display the state produced by the game rules.

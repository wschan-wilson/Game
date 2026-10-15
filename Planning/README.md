# Planning

This folder collects decisions and requirements that must be confirmed before implementation. The game specification is in [Specifications of the game.md](./Specifications%20of%20the%20game.md).

## Input categories

- [Game Rules and Match Flow](./Game%20Rules%20and%20Match%20Flow/README.md): ties, elimination, timeouts, and round progression.
- [Bot Behavior](./Bot%20Behavior/README.md): bot strategies, constraints, and repeatability.
- [Technical Setup](./Technical%20Setup/README.md): framework, tools, and project constraints.
- [Testing and Release](./Testing%20and%20Release/README.md): acceptance checks, supported devices, and publishing.
- [Aesthetic Design References](../Layout/Aesthetic%20Design%20References/README.md): visual direction and the provided layout image.
- [Screen and Interaction Requirements](../Layout/Screen%20and%20Interaction%20Requirements/README.md): setup fields, controls, feedback, and accessibility.

## Planning workflow

1. Gather one category of user input at a time.
2. Record confirmed decisions in the relevant category; keep unresolved items explicitly marked as open.
3. Update the game specification and acceptance criteria when a decision changes expected behavior.
4. Begin implementation only after the user approves the completed plan.

## Documentation alignment

The approved no-restart and no-persistence choices differ from the current root README, which asks players to start another match and leaves persistence undecided. Reconcile those requirements in the root README after the plan is approved.

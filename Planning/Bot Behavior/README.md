# Bot Behavior

**Status:** Bot behavior and strategies confirmed for the first demo.

## Confirmed decisions

- Use four distinct, documented strategies.
- Bot choices are deterministic so the same current-match history produces repeatable results and tests.
- Strategies may adapt deterministically using earlier round results.
- Bots may use all publicly shown prior-round inputs and outcomes.
- Use one fixed difficulty for the first demo.
- Strategies are preset for the demo; bots may use values and outcomes from earlier rounds in the current match only.
- Every new match starts with the same strategy definitions. No learned state carries over between matches.
- All four bots remain deterministic; no mixed strategy is included in the first demo.
- Bot1 estimates its autoregressive coefficients from the current match's completed benchmarks using ordinary least squares, and selects lag order with AICc; see [the strategy details and academic reference](./Proposed%20Strategies.md#bot1-autoregressive-method).
- Bot2 uses the same estimator and criterion with the distinct AR(0)/AR(1) candidate orders; see [the Bot2 strategy details](./Proposed%20Strategies.md#bot2-low-order-autoregressive-method).

## Implementation contract

- Each active bot submits exactly one integer from 0 through 100 per round.
- Bots lock their deterministic choices automatically before the human locks, so the human's lock completes the all-players-locked condition.
- Bot logic must be separate from UI code and return a valid game action.
- Implement the four approved strategies in [Proposed Strategies.md](./Proposed%20Strategies.md).
- Strategy decisions must be reproducible from the same public match history.

# Proposed Bot Strategies

**Status:** Approved for the first demo.

## Shared rules

- Each bot acts once per round using only public results from completed rounds; it cannot see the human's current-round value before submitting.
- Strategy definitions are preset. Each new match resets to the same definitions and opening values; no learning carries between matches.
- All bots are deterministic; identical current-match history always produces identical choices.
- Each strategy returns an integer from 0 through 100.
- Convert a calculated decimal to the nearest integer, with exact halves rounded upward, then clamp the result to 0–100.
- Use a distinct opening value in round 1, before any match history exists.

## Strategies

| Bot | Strategy | Choice from round 2 onward | Round 1 opening value |
|---|---|---|---:|
| Bot1 | Current-match autoregression | Forecast the next benchmark with the AR model specified below; use its fallback when there is insufficient history or no valid fit. | 20 |
| Bot2 | Low-order current-match autoregression | Forecast with the AR(0)/AR(1) candidate set specified below; use its fallback when there is insufficient history or no valid fit. | 40 |
| Bot3 | Human-history follower | Calculate 0.8 times the mean of the human player's valid values from all previous rounds, then round to the nearest integer. If the human has no valid prior values, use the opening value. | 60 |
| Bot4 | Recent crowd median | Calculate 0.8 times the median of all valid submitted values in the previous round, then round to the nearest integer. If there were no valid previous-round values, use the opening value. | 80 |

### Bot1 autoregressive method

- The time series is the sequence of **unrounded benchmarks** from completed rounds in the current match only. No model parameters or observations carry over between matches.
- For candidate order `p = 1` or `p = 2`, fit `B_t = c + φ₁B_(t-1) + ... + φₚB_(t-p) + ε_t`, where `B_t` is a completed-round benchmark. Estimate the intercept and lag coefficients with ordinary least squares, minimizing one-step-ahead squared residuals.
- Fit both candidate orders on the same observations, `t = 3...T`, so their information criteria are comparable. Let `n = T - 2`. For each fit with positive residual sum of squares, calculate `AICc = n ln(RSS/n) + 2K + 2K(K+1)/(n-K-1)`, where `K = p + 2` counts the intercept, `p` lag coefficients, and residual variance. Only compare a model when `n > K + 1`; choose the eligible model with the lowest AICc.
- If there is not enough history for an eligible fit, or all fits are invalid, forecast the last completed benchmark. (For example, AR(1) first becomes eligible at `T = 7`, and AR(2) at `T = 8` under the shared-observation rule.) On round 1, use the opening value `20`.
- Forecast the next benchmark from the selected model, clamp the prediction to the legal benchmark range `0–80`, then round to the nearest integer with exact halves rounded upward. Use that integer as Bot1's input.
- Bot1 cannot observe any current-round submissions before locking its choice.

This uses standard autoregressive modeling of lagged observations, least-squares coefficient estimation, and AICc's small-sample correction for choosing model order. See Hyndman and Athanasopoulos, [*Forecasting: Principles and Practice*, ARIMA models](https://otexts.com/fpp3/arima.html).

### Bot2 low-order autoregressive method

- Use the same current-match, unrounded benchmark series as Bot1. Do not carry data or fitted parameters into another match.
- Consider candidate orders `p = 0` and `p = 1`, using `B_t = c + φ₁B_(t-1) + ... + φₚB_(t-p) + ε_t`. For `p = 0`, the model is an intercept-only forecast (the mean of its training benchmarks); for `p = 1`, it uses the previous benchmark as a lagged predictor.
- Fit both candidates on the same observations, `t = 2...T`, with ordinary least squares. Let `n = T - 1`, `K = p + 2`, and calculate AICc with the formula above. Only compare a model when `n > K + 1`; choose the eligible model with the lowest AICc. This gives Bot2 a simpler order set than Bot1's `{1, 2}`.
- If there is not enough history for an eligible fit, or all fits are invalid, forecast the last completed benchmark. (The `p = 0` model first becomes eligible at `T = 5`; `p = 1` at `T = 6`.) On round 1, use the opening value `40`.
- Clamp the forecast to `0–80`, then round to the nearest integer with exact halves rounded upward. Use that integer as Bot2's input; it cannot observe current-round submissions before locking.

Bot2 uses the same least-squares and AICc theory as Bot1, but its lower candidate lag orders make it a distinct, simpler estimator. See Hyndman and Athanasopoulos, [*Forecasting: Principles and Practice*, ARIMA models](https://otexts.com/fpp3/arima.html).

## Verification requirements

- Test each opening value, history-based calculation, rounding boundary, and 0–100 clamp.
- Test missing human values and missing values in a prior round.
- Test Bot1's least-squares coefficients, AICc order selection, insufficient-history fallback, invalid-fit fallback, and benchmark-range clamp.
- Test Bot2's AR(0)/AR(1) coefficient fitting, AICc order selection, insufficient-history fallback, invalid-fit fallback, and benchmark-range clamp.
- Verify Bot1's fitted parameters are recalculated from the current match only and reset for a new match.
- Verify Bot2's fitted parameters are recalculated from the current match only and reset for a new match.
- Given identical completed-round history, every bot must return the same value.
- Do not change the actual round benchmark or winner calculation to match a bot's estimate.

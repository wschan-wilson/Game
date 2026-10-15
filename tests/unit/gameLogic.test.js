import test from "node:test";
import assert from "node:assert/strict";
import {
  applyRoundToPlayers,
  computeRound,
  createPlayers,
  formatNumber,
  isMatchOver,
  parseRoundIntegerInput
} from "../../src/gameLogic.js";

test("computeRound calculates mean and benchmark from valid values only", () => {
  const result = computeRound([
    { playerId: "a", value: null },
    { playerId: "b", value: 10 },
    { playerId: "c", value: 20 },
    { playerId: "d", value: 30 },
    { playerId: "e", value: null }
  ]);
  assert.equal(result.mean, 20);
  assert.equal(result.benchmark, 16);
});

test("computeRound supports ties among closest values", () => {
  const result = computeRound([
    { playerId: "a", value: 10 },
    { playerId: "b", value: 14 },
    { playerId: "c", value: 14 },
    { playerId: "d", value: 40 },
    { playerId: "e", value: 50 }
  ]);
  const winners = result.outcomes.filter((outcome) => outcome.isWinner).map((outcome) => outcome.playerId);
  assert.deepEqual(winners.sort(), ["b", "c"]);
});

test("parseRoundIntegerInput validates inclusive 0-100 integers", () => {
  assert.equal(parseRoundIntegerInput("0"), 0);
  assert.equal(parseRoundIntegerInput("100"), 100);
  assert.equal(parseRoundIntegerInput("12.4"), null);
  assert.equal(parseRoundIntegerInput("-1"), null);
  assert.equal(parseRoundIntegerInput("101"), null);
});

test("applyRoundToPlayers updates lives and elimination state", () => {
  const players = createPlayers("Player");
  for (let i = 0; i < 10; i += 1) {
    applyRoundToPlayers(players, [
      { playerId: "human", isWinner: false, lostLife: true },
      { playerId: "bot1", isWinner: true, lostLife: false },
      { playerId: "bot2", isWinner: true, lostLife: false },
      { playerId: "bot3", isWinner: true, lostLife: false },
      { playerId: "bot4", isWinner: true, lostLife: false }
    ]);
  }
  const human = players.find((player) => player.id === "human");
  assert.equal(human.lives, 0);
  assert.equal(human.eliminated, true);
  assert.equal(isMatchOver(players).over, true);
});

test("formatNumber trims trailing zeros with max two decimals", () => {
  assert.equal(formatNumber(24), "24");
  assert.equal(formatNumber(24.5), "24.5");
  assert.equal(formatNumber(24.126), "24.13");
});

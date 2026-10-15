import {
  computeRound,
  createPlayers,
  applyRoundToPlayers,
  isMatchOver,
  parseRoundIntegerInput,
  formatNumber
} from "../src/gameLogic.js";
import { bot1Choice, bot2Choice, bot3Choice, bot4Choice } from "../src/bots.js";

const output = document.querySelector("#output");
let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (!condition) {
    failed += 1;
    output.textContent += `FAIL: ${message}\n`;
    return;
  }
  passed += 1;
  output.textContent += `PASS: ${message}\n`;
}

function testRoundMathAndWinners() {
  const submissions = [
    { playerId: "a", value: 10 },
    { playerId: "b", value: 20 },
    { playerId: "c", value: 30 },
    { playerId: "d", value: 40 },
    { playerId: "e", value: 50 }
  ];
  const result = computeRound(submissions);
  assert(result.mean === 30, "mean should be 30");
  assert(result.benchmark === 24, "benchmark should be 24");
  const winners = result.outcomes.filter((o) => o.isWinner).map((o) => o.playerId);
  assert(winners.length === 1 && winners[0] === "b", "20 should be the winner");
}

function testMissingSubmissionsExcluded() {
  const submissions = [
    { playerId: "a", value: null },
    { playerId: "b", value: null },
    { playerId: "c", value: 10 },
    { playerId: "d", value: 20 },
    { playerId: "e", value: 30 }
  ];
  const result = computeRound(submissions);
  assert(result.mean === 20, "mean should exclude N/A");
  assert(result.benchmark === 16, "benchmark should be 16");
  const missing = result.outcomes.find((o) => o.playerId === "a");
  assert(missing.lostLife === true, "missing input should lose life");
}

function testTieWinners() {
  const submissions = [
    { playerId: "a", value: 10 },
    { playerId: "b", value: 14 },
    { playerId: "c", value: 14 },
    { playerId: "d", value: 30 },
    { playerId: "e", value: 40 }
  ];
  const result = computeRound(submissions);
  const winners = result.outcomes.filter((o) => o.isWinner).map((o) => o.playerId);
  assert(winners.includes("b") && winners.includes("c"), "tied closest answers should both win");
}

function testInputValidation() {
  assert(parseRoundIntegerInput("50") === 50, "50 should parse");
  assert(parseRoundIntegerInput("100") === 100, "100 should parse");
  assert(parseRoundIntegerInput("101") === null, "101 should fail");
  assert(parseRoundIntegerInput("12.3") === null, "non-integer should fail");
}

function testBotOpeningAndFallbacks() {
  assert(bot1Choice([]) === 20, "bot1 opening should be 20");
  assert(bot2Choice([]) === 40, "bot2 opening should be 40");
  assert(bot3Choice([]) === 60, "bot3 opening should be 60");
  assert(bot4Choice([]) === 80, "bot4 opening should be 80");
}

function testLifeAndTermination() {
  const players = createPlayers("P");
  for (let i = 0; i < 10; i += 1) {
    applyRoundToPlayers(players, [
      { playerId: "human", isWinner: false, lostLife: true },
      { playerId: "bot1", isWinner: true, lostLife: false },
      { playerId: "bot2", isWinner: true, lostLife: false },
      { playerId: "bot3", isWinner: true, lostLife: false },
      { playerId: "bot4", isWinner: true, lostLife: false }
    ]);
  }
  const finalState = isMatchOver(players);
  assert(finalState.over === true && finalState.humanWon === false, "human elimination should end match");
}

function testFormatting() {
  assert(formatNumber(24) === "24", "integer formatting");
  assert(formatNumber(24.5) === "24.5", "single decimal formatting");
  assert(formatNumber(24.126) === "24.13", "round to two decimals");
}

function run() {
  testRoundMathAndWinners();
  testMissingSubmissionsExcluded();
  testTieWinners();
  testInputValidation();
  testBotOpeningAndFallbacks();
  testLifeAndTermination();
  testFormatting();
  output.textContent += `\nSummary: ${passed} passed, ${failed} failed.\n`;
  if (failed === 0) {
    output.className = "ok";
  } else {
    output.className = "fail";
  }
}

run();


import test from "node:test";
import assert from "node:assert/strict";
import { bot1Choice, bot2Choice, bot3Choice, bot4Choice } from "../../src/bots.js";

test("bots use configured opening values", () => {
  assert.equal(bot1Choice([]), 20);
  assert.equal(bot2Choice([]), 40);
  assert.equal(bot3Choice([]), 60);
  assert.equal(bot4Choice([]), 80);
});

test("bot3 uses 0.8 of human valid-value history", () => {
  const history = [
    {
      submissions: [
        { playerId: "human", value: 10 }
      ],
      benchmark: 8
    },
    {
      submissions: [
        { playerId: "human", value: 20 }
      ],
      benchmark: 16
    }
  ];
  assert.equal(bot3Choice(history), 12);
});

test("bot4 uses prior-round valid median", () => {
  const history = [
    {
      submissions: [
        { playerId: "human", value: 40 },
        { playerId: "bot1", value: 10 },
        { playerId: "bot2", value: 20 },
        { playerId: "bot3", value: null },
        { playerId: "bot4", value: 30 }
      ],
      benchmark: 20
    }
  ];
  assert.equal(bot4Choice(history), 20);
});

test("AR bots are deterministic for the same history", () => {
  const history = [
    { benchmark: 20, submissions: [] },
    { benchmark: 18, submissions: [] },
    { benchmark: 16, submissions: [] },
    { benchmark: 19, submissions: [] },
    { benchmark: 17, submissions: [] },
    { benchmark: 15, submissions: [] },
    { benchmark: 18, submissions: [] },
    { benchmark: 16, submissions: [] }
  ];
  assert.equal(bot1Choice(history), bot1Choice(history));
  assert.equal(bot2Choice(history), bot2Choice(history));
});

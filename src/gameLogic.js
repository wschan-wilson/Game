export const INITIAL_LIVES = 10;
export const ROUND_SECONDS = 30;

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function roundHalfUp(value) {
  return Math.floor(value + 0.5);
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export function isValidRoundIntegerInput(valueText) {
  const trimmed = String(valueText).trim();
  if (!/^\d+$/.test(trimmed)) {
    return false;
  }
  const value = Number(trimmed);
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

export function parseRoundIntegerInput(valueText) {
  if (!isValidRoundIntegerInput(valueText)) {
    return null;
  }
  return Number(String(valueText).trim());
}

export function createPlayers(humanName) {
  return [
    {
      id: "bot1",
      name: "Bot1",
      isHuman: false,
      lives: INITIAL_LIVES,
      eliminated: false,
      lifeHistory: [INITIAL_LIVES]
    },
    {
      id: "bot2",
      name: "Bot2",
      isHuman: false,
      lives: INITIAL_LIVES,
      eliminated: false,
      lifeHistory: [INITIAL_LIVES]
    },
    {
      id: "human",
      name: humanName,
      isHuman: true,
      lives: INITIAL_LIVES,
      eliminated: false,
      lifeHistory: [INITIAL_LIVES]
    },
    {
      id: "bot3",
      name: "Bot3",
      isHuman: false,
      lives: INITIAL_LIVES,
      eliminated: false,
      lifeHistory: [INITIAL_LIVES]
    },
    {
      id: "bot4",
      name: "Bot4",
      isHuman: false,
      lives: INITIAL_LIVES,
      eliminated: false,
      lifeHistory: [INITIAL_LIVES]
    }
  ];
}

export function activePlayers(players) {
  return players.filter((p) => !p.eliminated);
}

export function computeRound(submissions) {
  const validValues = submissions
    .map((s) => s.value)
    .filter((value) => Number.isInteger(value));

  const mean = validValues.length > 0
    ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length
    : null;
  const benchmark = mean !== null ? mean * 0.8 : null;

  let winningIds = [];
  if (benchmark !== null && validValues.length > 0) {
    const distances = submissions
      .filter((s) => Number.isInteger(s.value))
      .map((s) => ({
        id: s.playerId,
        distance: Math.abs(s.value - benchmark)
      }));
    const minDistance = Math.min(...distances.map((d) => d.distance));
    winningIds = distances
      .filter((d) => d.distance === minDistance)
      .map((d) => d.id);
  }

  const winners = new Set(winningIds);
  const outcomes = submissions.map((submission) => ({
    playerId: submission.playerId,
    isWinner: winners.has(submission.playerId),
    lostLife: !winners.has(submission.playerId)
  }));

  return { mean, benchmark, outcomes };
}

export function applyRoundToPlayers(players, outcomes) {
  const outcomeById = new Map(outcomes.map((o) => [o.playerId, o]));
  for (const player of players) {
    if (player.eliminated) {
      player.lifeHistory.push(player.lives);
      continue;
    }
    const outcome = outcomeById.get(player.id);
    if (!outcome) {
      player.lifeHistory.push(player.lives);
      continue;
    }
    if (outcome.lostLife) {
      player.lives -= 1;
    }
    if (player.lives <= 0) {
      player.lives = 0;
      player.eliminated = true;
    }
    player.lifeHistory.push(player.lives);
  }
}

export function isMatchOver(players) {
  const human = players.find((p) => p.isHuman);
  if (!human) {
    return { over: true, humanWon: false };
  }
  if (human.eliminated || human.lives <= 0) {
    return { over: true, humanWon: false };
  }
  const alive = players.filter((p) => !p.eliminated);
  if (alive.length === 1 && alive[0].id === human.id) {
    return { over: true, humanWon: true };
  }
  return { over: false, humanWon: false };
}


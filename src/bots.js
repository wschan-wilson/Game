import { clamp, roundHalfUp } from "./gameLogic.js";

function olsFit(designRows, yValues) {
  if (designRows.length === 0 || yValues.length === 0 || designRows.length !== yValues.length) {
    return null;
  }
  const cols = designRows[0].length;
  const ata = Array.from({ length: cols }, () => Array(cols).fill(0));
  const aty = Array(cols).fill(0);
  for (let r = 0; r < designRows.length; r += 1) {
    const row = designRows[r];
    const y = yValues[r];
    for (let i = 0; i < cols; i += 1) {
      aty[i] += row[i] * y;
      for (let j = 0; j < cols; j += 1) {
        ata[i][j] += row[i] * row[j];
      }
    }
  }
  const inverse = invertMatrix(ata);
  if (!inverse) {
    return null;
  }
  const beta = multiplyMatrixVector(inverse, aty);
  const residuals = [];
  for (let r = 0; r < designRows.length; r += 1) {
    const prediction = dot(designRows[r], beta);
    residuals.push(yValues[r] - prediction);
  }
  const rss = residuals.reduce((sum, value) => sum + (value * value), 0);
  if (!(rss > 0)) {
    return null;
  }
  return { beta, rss };
}

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
}

function multiplyMatrixVector(matrix, vector) {
  return matrix.map((row) => dot(row, vector));
}

function invertMatrix(matrix) {
  const n = matrix.length;
  const augmented = matrix.map((row, rowIndex) => {
    const identity = Array.from({ length: n }, (_, i) => (i === rowIndex ? 1 : 0));
    return [...row, ...identity];
  });
  for (let i = 0; i < n; i += 1) {
    let pivot = i;
    while (pivot < n && Math.abs(augmented[pivot][i]) < 1e-12) {
      pivot += 1;
    }
    if (pivot === n) {
      return null;
    }
    if (pivot !== i) {
      const temp = augmented[i];
      augmented[i] = augmented[pivot];
      augmented[pivot] = temp;
    }
    const pivotValue = augmented[i][i];
    for (let j = 0; j < 2 * n; j += 1) {
      augmented[i][j] /= pivotValue;
    }
    for (let r = 0; r < n; r += 1) {
      if (r === i) {
        continue;
      }
      const factor = augmented[r][i];
      for (let c = 0; c < 2 * n; c += 1) {
        augmented[r][c] -= factor * augmented[i][c];
      }
    }
  }
  return augmented.map((row) => row.slice(n));
}

function computeAicc(n, k, rss) {
  if (!(rss > 0) || n <= k + 1) {
    return null;
  }
  return (n * Math.log(rss / n)) + (2 * k) + ((2 * k * (k + 1)) / (n - k - 1));
}

function clampBenchmarkPrediction(rawPrediction) {
  return clamp(rawPrediction, 0, 80);
}

function finalizeBotChoice(rawPrediction) {
  return clamp(roundHalfUp(rawPrediction), 0, 100);
}

function fitArModel(series, p, startAt, endAt) {
  const rows = [];
  const yValues = [];
  for (let t = startAt; t <= endAt; t += 1) {
    const row = [1];
    for (let lag = 1; lag <= p; lag += 1) {
      row.push(series[t - lag]);
    }
    rows.push(row);
    yValues.push(series[t]);
  }
  return olsFit(rows, yValues);
}

function forecastFromCoefficients(beta, latestSeries, p) {
  const row = [1];
  for (let lag = 1; lag <= p; lag += 1) {
    row.push(latestSeries[latestSeries.length - lag]);
  }
  return dot(row, beta);
}

function chooseArForecast(benchmarks, orders, sharedStartIndex) {
  const tMax = benchmarks.length - 1;
  let best = null;
  for (const p of orders) {
    const fit = fitArModel(benchmarks, p, sharedStartIndex, tMax);
    if (!fit) {
      continue;
    }
    const n = tMax - sharedStartIndex + 1;
    const k = p + 2;
    const aicc = computeAicc(n, k, fit.rss);
    if (aicc === null) {
      continue;
    }
    if (!best || aicc < best.aicc) {
      best = { p, beta: fit.beta, aicc };
    }
  }
  if (!best) {
    return benchmarks[benchmarks.length - 1];
  }
  return forecastFromCoefficients(best.beta, benchmarks, best.p);
}

function getBenchmarkHistory(matchHistory) {
  return matchHistory.map((round) => round.benchmark).filter((b) => typeof b === "number" && Number.isFinite(b));
}

export function bot1Choice(matchHistory) {
  if (matchHistory.length === 0) {
    return 20;
  }
  const benchmarks = getBenchmarkHistory(matchHistory);
  if (benchmarks.length === 0) {
    return 20;
  }
  const forecast = chooseArForecast(benchmarks, [1, 2], 2);
  return finalizeBotChoice(clampBenchmarkPrediction(forecast));
}

export function bot2Choice(matchHistory) {
  if (matchHistory.length === 0) {
    return 40;
  }
  const benchmarks = getBenchmarkHistory(matchHistory);
  if (benchmarks.length === 0) {
    return 40;
  }
  const forecast = chooseArForecast(benchmarks, [0, 1], 1);
  return finalizeBotChoice(clampBenchmarkPrediction(forecast));
}

export function bot3Choice(matchHistory) {
  if (matchHistory.length === 0) {
    return 60;
  }
  const humanValues = matchHistory
    .map((round) => round.submissions.find((s) => s.playerId === "human"))
    .filter((submission) => submission && Number.isInteger(submission.value))
    .map((submission) => submission.value);
  if (humanValues.length === 0) {
    return 60;
  }
  const mean = humanValues.reduce((sum, value) => sum + value, 0) / humanValues.length;
  return finalizeBotChoice(clamp(0.8 * mean, 0, 100));
}

export function bot4Choice(matchHistory) {
  if (matchHistory.length === 0) {
    return 80;
  }
  const lastRound = matchHistory[matchHistory.length - 1];
  const validValues = lastRound.submissions
    .map((s) => s.value)
    .filter((value) => Number.isInteger(value))
    .sort((a, b) => a - b);
  if (validValues.length === 0) {
    return 80;
  }
  const middle = Math.floor(validValues.length / 2);
  const median = validValues.length % 2 === 0
    ? (validValues[middle - 1] + validValues[middle]) / 2
    : validValues[middle];
  return finalizeBotChoice(clamp(0.8 * median, 0, 100));
}

export function botChoiceFor(playerId, matchHistory) {
  if (playerId === "bot1") {
    return bot1Choice(matchHistory);
  }
  if (playerId === "bot2") {
    return bot2Choice(matchHistory);
  }
  if (playerId === "bot3") {
    return bot3Choice(matchHistory);
  }
  if (playerId === "bot4") {
    return bot4Choice(matchHistory);
  }
  throw new Error(`Unknown bot id: ${playerId}`);
}


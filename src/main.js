import {
  createPlayers,
  parseRoundIntegerInput,
  isValidRoundIntegerInput,
  computeRound,
  applyRoundToPlayers,
  isMatchOver,
  activePlayers,
  formatNumber
} from "./gameLogic.js";
import { botChoiceFor } from "./bots.js";

const app = document.querySelector("#app");
const DEFAULT_ROUND_SECONDS = 30;

function getRoundDurationSeconds() {
  const params = new URLSearchParams(window.location.search);
  const parsed = Number.parseInt(params.get("roundSeconds") || "", 10);
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= DEFAULT_ROUND_SECONDS) {
    return parsed;
  }
  return DEFAULT_ROUND_SECONDS;
}

const state = {
  phase: "setup",
  players: [],
  roundNumber: 0,
  matchHistory: [],
  pendingRound: null,
  timerHandle: null,
  roundDurationSeconds: getRoundDurationSeconds(),
  setupNameDraft: "",
  setupNameConfirmed: false
};

function render() {
  if (!app) {
    return;
  }
  app.innerHTML = "";
  if (state.phase === "setup") {
    renderSetupScreen();
    return;
  }
  if (state.phase === "input") {
    renderRoundInputScreen();
    return;
  }
  if (state.phase === "results") {
    renderRoundResultsScreen();
    return;
  }
  if (state.phase === "final") {
    renderFinalScreen();
  }
}

function createPlayerCards(players, centerHuman = false) {
  const cards = document.createElement("div");
  cards.className = "player-cards";

  const cardOrder = centerHuman
    ? [...players]
    : [...players].sort((a, b) => {
      if (a.id === "human") {
        return 1;
      }
      if (b.id === "human") {
        return -1;
      }
      return a.id.localeCompare(b.id);
    });

  for (const player of cardOrder) {
    const card = document.createElement("section");
    card.className = `player-card${player.eliminated ? " eliminated" : ""}`;
    card.dataset.playerId = player.id;
    const title = document.createElement("h3");
    title.textContent = player.name;
    card.appendChild(title);
    const role = document.createElement("p");
    role.className = "meta";
    role.textContent = player.isHuman ? "You" : "Bot";
    card.appendChild(role);
    cards.appendChild(card);
  }
  return cards;
}

function renderSetupScreen() {
  const panel = document.createElement("section");
  panel.className = "panel";

  const heading = document.createElement("h1");
  heading.textContent = "Benchmark Battle";
  heading.id = "game-title";
  panel.appendChild(heading);

  const instruction = document.createElement("p");
  instruction.className = "lead";
  instruction.textContent = "Input username";
  panel.appendChild(instruction);

  const previewPlayers = createPlayers(state.setupNameDraft || "Your Name");
  const previewCards = createPlayerCards(previewPlayers, true);
  panel.appendChild(previewCards);

  const form = document.createElement("form");
  form.className = "stack";
  form.noValidate = true;

  const feedback = document.createElement("p");
  feedback.className = "feedback";
  feedback.id = "username-feedback";
  form.appendChild(feedback);

  let input = null;
  if (!state.setupNameConfirmed) {
    input = document.createElement("input");
    input.type = "text";
    input.name = "username";
    input.id = "username-input";
    input.maxLength = 20;
    input.placeholder = "1-20 chars, letters/numbers/spaces";
    input.required = true;
    input.autocomplete = "nickname";
    input.value = state.setupNameDraft;
    input.addEventListener("input", () => {
      state.setupNameDraft = input.value;
      const humanPreviewName = previewCards.querySelector('[data-player-id="human"] h3');
      if (humanPreviewName) {
        humanPreviewName.textContent = input.value.trim() || "Your Name";
      }
    });
    form.prepend(input);

    const confirmButton = document.createElement("button");
    confirmButton.type = "submit";
    confirmButton.textContent = "Confirm username";
    confirmButton.id = "confirm-username";
    form.appendChild(confirmButton);
  } else {
    const proceedButton = document.createElement("button");
    proceedButton.type = "submit";
    proceedButton.textContent = "Click to proceed";
    proceedButton.id = "proceed-setup";
    form.appendChild(proceedButton);
    feedback.textContent = "Username ready.";
    feedback.className = "feedback success";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.setupNameConfirmed) {
      const rawName = input ? input.value : state.setupNameDraft;
      const name = String(rawName || "").trim();
      if (!/^[A-Za-z0-9 ]{1,20}$/.test(name)) {
        feedback.textContent = "Use 1-20 letters, numbers, or spaces.";
        feedback.className = "feedback error";
        return;
      }
      state.setupNameDraft = name;
      state.setupNameConfirmed = true;
      render();
      return;
    }
    state.players = createPlayers(state.setupNameDraft);
    startNewRound();
  });

  panel.appendChild(form);
  app.appendChild(panel);
}

function startNewRound() {
  stopTimer();
  state.roundNumber += 1;
  const submissions = [];
  const active = activePlayers(state.players);
  for (const player of active) {
    if (player.isHuman) {
      submissions.push({ playerId: player.id, value: null, locked: false });
    } else {
      submissions.push({
        playerId: player.id,
        value: botChoiceFor(player.id, state.matchHistory),
        locked: true
      });
    }
  }
  state.pendingRound = {
    roundNumber: state.roundNumber,
    secondsLeft: state.roundDurationSeconds,
    latestHumanValidValue: null,
    humanDraftInput: "",
    humanMessage: "",
    submissions
  };
  state.phase = "input";
  render();
  state.timerHandle = window.setInterval(tickRoundTimer, 1000);
}

function tickRoundTimer() {
  if (!state.pendingRound || state.phase !== "input") {
    stopTimer();
    return;
  }
  state.pendingRound.secondsLeft -= 1;
  if (state.pendingRound.secondsLeft <= 0) {
    lockHumanOnTimeout();
    return;
  }
  updateRoundTimerDisplay();
}

function stopTimer() {
  if (state.timerHandle !== null) {
    window.clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}

function updateRoundTimerDisplay() {
  const timer = document.querySelector("#round-timer");
  if (timer && state.pendingRound) {
    timer.textContent = `Time left: ${state.pendingRound.secondsLeft}s`;
  }
}

function setRoundInputFeedback(feedbackElement, message, type) {
  feedbackElement.textContent = message;
  feedbackElement.className = "feedback";
  if (type === "error") {
    feedbackElement.classList.add("error");
  } else if (type === "success") {
    feedbackElement.classList.add("success");
  }
}

function renderRoundInputScreen() {
  const panel = document.createElement("section");
  panel.className = "panel";

  const timer = document.createElement("h2");
  timer.className = "timer";
  timer.id = "round-timer";
  timer.textContent = `Time left: ${state.pendingRound.secondsLeft}s`;
  panel.appendChild(timer);

  const title = document.createElement("h1");
  title.textContent = `Round ${state.roundNumber}`;
  panel.appendChild(title);

  const prompt = document.createElement("p");
  prompt.className = "lead";
  prompt.textContent = "Input an integer between 0 and 100";
  panel.appendChild(prompt);

  const human = state.players.find((p) => p.isHuman);
  const humanSubmission = state.pendingRound.submissions.find((s) => s.playerId === "human");

  const form = document.createElement("form");
  form.className = "stack";
  form.noValidate = true;

  const input = document.createElement("input");
  input.type = "text";
  input.id = "round-input";
  input.inputMode = "numeric";
  input.pattern = "\\d*";
  input.placeholder = "0-100";
  input.disabled = humanSubmission.locked;
  input.value = humanSubmission.locked && Number.isInteger(humanSubmission.value)
    ? String(humanSubmission.value)
    : state.pendingRound.humanDraftInput;
  form.appendChild(input);

  const feedback = document.createElement("p");
  feedback.className = "feedback";
  feedback.textContent = state.pendingRound.humanMessage;
  if (state.pendingRound.humanMessage === "Your input is not an integer") {
    feedback.classList.add("error");
  } else if (state.pendingRound.humanMessage === "Your input is registered") {
    feedback.classList.add("success");
  }
  form.appendChild(feedback);

  const lockButton = document.createElement("button");
  lockButton.type = "submit";
  lockButton.id = "lock-value";
  lockButton.textContent = humanSubmission.locked ? "Locked" : "Lock value";
  lockButton.disabled = humanSubmission.locked;
  form.appendChild(lockButton);

  input.addEventListener("input", () => {
    if (humanSubmission.locked) {
      return;
    }
    state.pendingRound.humanDraftInput = input.value;
    if (isValidRoundIntegerInput(input.value)) {
      state.pendingRound.latestHumanValidValue = parseRoundIntegerInput(input.value);
      state.pendingRound.humanMessage = "Your input is registered";
      setRoundInputFeedback(feedback, state.pendingRound.humanMessage, "success");
    } else {
      state.pendingRound.humanMessage = "Your input is not an integer";
      setRoundInputFeedback(feedback, state.pendingRound.humanMessage, "error");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (humanSubmission.locked) {
      return;
    }
    const parsed = parseRoundIntegerInput(state.pendingRound.humanDraftInput);
    if (!Number.isInteger(parsed)) {
      state.pendingRound.humanMessage = "Your input is not an integer";
      setRoundInputFeedback(feedback, state.pendingRound.humanMessage, "error");
      return;
    }
    lockHumanSubmission(parsed);
  });

  const info = document.createElement("p");
  info.className = "meta";
  info.textContent = `${human.name} can edit a valid value until it is locked.`;

  panel.appendChild(form);
  panel.appendChild(info);
  app.appendChild(panel);
}

function lockHumanSubmission(value) {
  const humanSubmission = state.pendingRound.submissions.find((s) => s.playerId === "human");
  humanSubmission.value = value;
  humanSubmission.locked = true;
  state.pendingRound.latestHumanValidValue = value;
  state.pendingRound.humanMessage = "Your input is registered";
  completeRoundIfAllLocked();
}

function lockHumanOnTimeout() {
  const humanSubmission = state.pendingRound.submissions.find((s) => s.playerId === "human");
  if (humanSubmission.locked) {
    completeRoundIfAllLocked();
    return;
  }
  if (Number.isInteger(state.pendingRound.latestHumanValidValue)) {
    humanSubmission.value = state.pendingRound.latestHumanValidValue;
  } else {
    humanSubmission.value = null;
  }
  humanSubmission.locked = true;
  completeRoundIfAllLocked();
}

function completeRoundIfAllLocked() {
  const allLocked = state.pendingRound.submissions.every((s) => s.locked);
  if (!allLocked) {
    render();
    return;
  }
  stopTimer();
  const publicRound = {
    roundNumber: state.pendingRound.roundNumber,
    submissions: state.pendingRound.submissions.map((s) => ({
      playerId: s.playerId,
      value: s.value
    }))
  };
  const computed = computeRound(publicRound.submissions);
  const roundResult = {
    roundNumber: state.pendingRound.roundNumber,
    submissions: publicRound.submissions,
    mean: computed.mean,
    benchmark: computed.benchmark,
    outcomes: computed.outcomes
  };
  state.matchHistory.push(roundResult);
  applyRoundToPlayers(state.players, computed.outcomes);
  state.pendingRound = null;
  state.phase = "results";
  render();
}

function renderRoundResultsScreen() {
  const panel = document.createElement("section");
  panel.className = "panel";
  const round = state.matchHistory[state.matchHistory.length - 1];

  const heading = document.createElement("h1");
  heading.textContent = `Round ${round.roundNumber} results`;
  panel.appendChild(heading);

  const stats = document.createElement("div");
  stats.className = "stats";
  const meanBox = document.createElement("p");
  meanBox.className = "stat";
  meanBox.textContent = `Mean = ${formatNumber(round.mean)}`;
  const benchBox = document.createElement("p");
  benchBox.className = "stat";
  benchBox.textContent = `Benchmark = ${formatNumber(round.benchmark)}`;
  stats.appendChild(meanBox);
  stats.appendChild(benchBox);
  panel.appendChild(stats);

  const cards = document.createElement("div");
  cards.className = "player-cards";

  const byId = new Map(round.submissions.map((s) => [s.playerId, s]));
  const outcomesById = new Map(round.outcomes.map((o) => [o.playerId, o]));
  for (const player of state.players) {
    const card = document.createElement("section");
    card.className = `player-card${player.eliminated ? " eliminated" : ""}`;
    const title = document.createElement("h3");
    title.textContent = player.name;
    card.appendChild(title);

    const submission = byId.get(player.id);
    const valueText = submission && Number.isInteger(submission.value) ? String(submission.value) : "N/A";
    const value = document.createElement("p");
    value.textContent = `Input: ${valueText}`;
    card.appendChild(value);

    const lives = document.createElement("p");
    lives.textContent = `Remaining life = ${player.lives}`;
    card.appendChild(lives);

    const outcome = outcomesById.get(player.id);
    const status = document.createElement("p");
    if (!outcome && player.eliminated) {
      status.textContent = "Eliminated";
      status.className = "loss";
    } else if (outcome && outcome.isWinner) {
      status.textContent = "Winner of the round";
      status.className = "win";
    } else {
      status.textContent = "Loser of the round";
      status.className = "loss";
    }
    card.appendChild(status);

    cards.appendChild(card);
  }
  panel.appendChild(cards);

  const proceed = document.createElement("button");
  proceed.id = "proceed-next-round";
  proceed.textContent = "Proceed to next round";
  proceed.addEventListener("click", () => {
    const matchState = isMatchOver(state.players);
    if (matchState.over) {
      state.phase = "final";
    } else {
      startNewRound();
      return;
    }
    render();
  });
  panel.appendChild(proceed);
  app.appendChild(panel);
}

function renderFinalScreen() {
  const panel = document.createElement("section");
  panel.className = "panel";
  const matchState = isMatchOver(state.players);

  const heading = document.createElement("h1");
  heading.id = "final-message";
  heading.textContent = matchState.humanWon
    ? "Congratulations, you are the winner."
    : "Well played, thank you for joining.";
  panel.appendChild(heading);

  const subheading = document.createElement("p");
  subheading.className = "lead";
  subheading.textContent = "Life history by round";
  panel.appendChild(subheading);

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 450;
  canvas.className = "chart";
  panel.appendChild(canvas);
  drawLifeChart(canvas, state.players);

  const note = document.createElement("p");
  note.className = "meta";
  note.textContent = "Refresh the page to start a new match.";
  panel.appendChild(note);

  app.appendChild(panel);
}

function drawLifeChart(canvas, players) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  const padding = 48;
  const width = canvas.width - (padding * 2);
  const height = canvas.height - (padding * 2);
  const rounds = players[0]?.lifeHistory.length ? players[0].lifeHistory.length - 1 : 0;
  const xForRound = (roundIndex) => padding + (rounds === 0 ? 0 : (roundIndex / rounds) * width);
  const yForLife = (life) => padding + ((10 - life) / 10) * height;

  context.fillStyle = "#0e1428";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#6b7280";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padding, padding);
  context.lineTo(padding, padding + height);
  context.lineTo(padding + width, padding + height);
  context.stroke();

  context.fillStyle = "#dbeafe";
  context.font = "14px Arial";
  context.fillText("Lives", 10, 20);
  context.fillText("Round", canvas.width - 70, canvas.height - 12);

  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#c084fc"];
  players.forEach((player, index) => {
    context.strokeStyle = colors[index % colors.length];
    context.lineWidth = 2;
    context.beginPath();
    player.lifeHistory.forEach((lives, roundIndex) => {
      const x = xForRound(roundIndex);
      const y = yForLife(lives);
      if (roundIndex === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  });

  players.forEach((player, index) => {
    context.fillStyle = colors[index % colors.length];
    context.fillRect(canvas.width - 170, 24 + (index * 24), 14, 14);
    context.fillStyle = "#f9fafb";
    context.fillText(player.name, canvas.width - 150, 36 + (index * 24));
  });
}

render();

(() => {
  'use strict';

  const STORE_KEY = 'study-flow-data-v1';
  const GOAL = 4;
  const $ = (selector) => document.querySelector(selector);
  const timeDisplay = $('#timer-time');
  const timerCircle = $('#timer-display');
  const timerCaption = $('#timer-caption');
  const timerMode = $('#timer-mode');
  const startButton = $('#start-button');
  const timerMessage = $('#timer-message');
  const focusInput = $('#focus-duration');
  const breakInput = $('#break-duration');
  let data = loadData();
  let mode = 'focus';
  let secondsLeft = durationFor('focus');
  let timerId = null;
  let endAt = null;

  function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function blankData() {
    return { day: todayKey(), sessions: 0, minutes: 0, tasks: [] };
  }

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!stored || typeof stored !== 'object') return blankData();
      const tasks = Array.isArray(stored.tasks) ? stored.tasks.filter((task) => task && typeof task.id === 'string' && typeof task.title === 'string').map((task) => ({
        id: task.id,
        title: task.title.slice(0, 120),
        subject: typeof task.subject === 'string' ? task.subject.slice(0, 60) : '',
        completed: Boolean(task.completed),
        createdAt: Number.isFinite(task.createdAt) ? task.createdAt : Date.now(),
      })) : [];
      if (stored.day !== todayKey()) return { ...blankData(), tasks };
      return { day: stored.day, sessions: validCount(stored.sessions), minutes: validCount(stored.minutes), tasks };
    } catch {
      return blankData();
    }
  }

  function validCount(value) {
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function saveData() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
      timerMessage.textContent = 'Your settings are saved on this device.';
    } catch {
      timerMessage.textContent = 'Browser storage is unavailable. Your changes may not be saved.';
    }
  }

  function refreshDay() {
    if (data.day !== todayKey()) {
      data.day = todayKey();
      data.sessions = 0;
      data.minutes = 0;
      saveData();
    }
  }

  function durationFor(which) {
    const input = which === 'focus' ? focusInput : breakInput;
    const parsed = Number.parseInt(input?.value || (which === 'focus' ? '25' : '5'), 10);
    const maximum = which === 'focus' ? 180 : 60;
    return Math.max(1, Math.min(maximum, Number.isFinite(parsed) ? parsed : (which === 'focus' ? 25 : 5))) * 60;
  }

  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function renderTimer() {
    timeDisplay.textContent = formatTime(secondsLeft);
    const spoken = `${Math.floor(secondsLeft / 60)} minutes and ${secondsLeft % 60} seconds remaining`;
    timerCircle.setAttribute('aria-label', spoken);
    timerCircle.classList.toggle('running', Boolean(timerId));
    timerCircle.classList.toggle('break', mode === 'break');
    timerMode.textContent = mode === 'focus' ? 'Focus session' : 'Break time';
    startButton.textContent = timerId ? 'Pause timer' : mode === 'focus' ? 'Start focus' : 'Start break';
    if (!timerId) timerCaption.textContent = mode === 'focus' ? 'Ready when you are' : 'A moment to recharge';
  }

  function finishTimer() {
    window.clearInterval(timerId);
    timerId = null;
    endAt = null;
    if (mode === 'focus') {
      refreshDay();
      data.sessions += 1;
      data.minutes += durationFor('focus') / 60;
      saveData();
      mode = 'break';
      secondsLeft = durationFor('break');
      timerCaption.textContent = 'Focus session complete — take a break.';
      timerMessage.textContent = 'Nice work. Your focus session was added to today’s progress.';
      renderProgress();
    } else {
      mode = 'focus';
      secondsLeft = durationFor('focus');
      timerCaption.textContent = 'Break complete — ready for another session?';
      timerMessage.textContent = 'Break complete. Start another focus session whenever you’re ready.';
    }
    renderTimer();
    notify(mode === 'break' ? 'Focus session complete. Time for a break.' : 'Break complete. Ready to focus again?');
  }

  function tick() {
    if (endAt === null) return;
    secondsLeft = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    if (secondsLeft <= 0) {
      finishTimer();
      return;
    }
    renderTimer();
  }

  function startTimer() {
    timerId = window.setInterval(tick, 250);
    endAt = Date.now() + secondsLeft * 1000;
    timerCaption.textContent = mode === 'focus' ? 'You’re doing great — stay with it.' : 'Step away and recharge.';
    renderTimer();
  }

  function pauseTimer() {
    window.clearInterval(timerId);
    timerId = null;
    endAt = null;
    timerCaption.textContent = 'Paused. Resume whenever you’re ready.';
    renderTimer();
    timerCaption.textContent = 'Paused. Resume whenever you’re ready.';
  }

  function resetTimer() {
    window.clearInterval(timerId);
    timerId = null;
    endAt = null;
    mode = 'focus';
    secondsLeft = durationFor('focus');
    timerMessage.textContent = 'Timer reset. Your completed progress is unchanged.';
    renderTimer();
  }

  function notify(message) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try { new Notification('Study Flow', { body: message }); } catch { /* Notifications may be unavailable in some browser contexts. */ }
  }

  function renderProgress() {
    refreshDay();
    $('#session-count').textContent = String(data.sessions);
    $('#minutes-count').textContent = `${data.minutes} min`;
    const fill = Math.min(100, (data.sessions / GOAL) * 100);
    $('#progress-fill').style.width = `${fill}%`;
    $('.progress-track').setAttribute('aria-valuenow', String(Math.min(GOAL, data.sessions)));
    $('#goal-copy').textContent = data.sessions >= GOAL ? 'You reached today’s gentle goal. Well done!' : `A gentle goal: ${GOAL} sessions today.`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function renderTasks() {
    const taskList = $('#task-list');
    const empty = $('#task-empty');
    const pending = data.tasks.filter((task) => !task.completed).length;
    $('#task-summary').textContent = data.tasks.length ? `${pending} to do · ${data.tasks.length - pending} completed` : 'No tasks yet.';
    empty.hidden = data.tasks.length > 0;
    taskList.innerHTML = data.tasks.map((task) => `<li class="task-item${task.completed ? ' completed' : ''}">
      <input class="task-check" type="checkbox" data-toggle-task="${escapeHtml(task.id)}" aria-label="Mark ${escapeHtml(task.title)} ${task.completed ? 'not completed' : 'completed'}"${task.completed ? ' checked' : ''} />
      <span class="task-copy"><strong>${escapeHtml(task.title)}</strong>${task.subject ? `<small>${escapeHtml(task.subject)}</small>` : ''}</span>
      <button class="delete-task" type="button" data-delete-task="${escapeHtml(task.id)}" aria-label="Delete task: ${escapeHtml(task.title)}">Delete</button>
    </li>`).join('');
  }

  $('#task-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const titleInput = $('#task-title');
    const subjectInput = $('#task-subject');
    const title = titleInput.value.trim();
    if (!title) return;
    data.tasks.unshift({ id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`, title: title.slice(0, 120), subject: subjectInput.value.trim().slice(0, 60), completed: false, createdAt: Date.now() });
    saveData();
    renderTasks();
    titleInput.value = '';
    subjectInput.value = '';
    titleInput.focus();
  });

  $('#task-list').addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-toggle-task]');
    if (!checkbox) return;
    const task = data.tasks.find((item) => item.id === checkbox.dataset.toggleTask);
    if (task) { task.completed = checkbox.checked; saveData(); renderTasks(); }
  });

  $('#task-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-task]');
    if (!button) return;
    data.tasks = data.tasks.filter((task) => task.id !== button.dataset.deleteTask);
    saveData();
    renderTasks();
  });

  $('#clear-completed').addEventListener('click', () => {
    data.tasks = data.tasks.filter((task) => !task.completed);
    saveData();
    renderTasks();
  });

  $('#clear-progress').addEventListener('click', () => {
    if (!data.sessions && !data.minutes) return;
    if (!window.confirm('Reset today’s completed sessions and minutes? Your revision tasks will stay.')) return;
    data.sessions = 0;
    data.minutes = 0;
    saveData();
    renderProgress();
  });

  startButton.addEventListener('click', () => timerId ? pauseTimer() : startTimer());
  $('#reset-button').addEventListener('click', resetTimer);
  [focusInput, breakInput].forEach((input) => input.addEventListener('change', () => {
    const limit = input === focusInput ? 180 : 60;
    input.value = String(Math.max(1, Math.min(limit, Number.parseInt(input.value, 10) || 1)));
    if (!timerId) {
      if (mode === 'focus') secondsLeft = durationFor('focus');
      renderTimer();
    }
  }));

  document.addEventListener('visibilitychange', () => {
    if (timerId && !document.hidden) tick();
  });
  $('#today-label').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());
  renderTimer();
  renderProgress();
  renderTasks();
})();

const STORAGE_KEYS = {
  measures: 'fit_tracker_measures',
  workouts: 'fit_tracker_workouts',
  exerciseLibrary: 'fit_tracker_exercise_library',
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
=======
  theme: 'fit_tracker_theme',
>>>>>>> theirs
=======
  theme: 'fit_tracker_theme',
>>>>>>> theirs
=======
  theme: 'fit_tracker_theme',
>>>>>>> theirs
};

const DEFAULT_LIBRARY = [
  { id: 'ex-1', muscle: 'Peito/Tríceps', exercise: 'Supino reto', reps: '4x10' },
  { id: 'ex-2', muscle: 'Costas/Bíceps', exercise: 'Puxada frontal', reps: '4x12' },
  { id: 'ex-3', muscle: 'Pernas', exercise: 'Agachamento livre', reps: '5x8' },
  { id: 'ex-4', muscle: 'Ombros', exercise: 'Desenvolvimento', reps: '4x10' },
  { id: 'ex-5', muscle: 'Core', exercise: 'Prancha', reps: '4x45s' },
  { id: 'ex-6', muscle: 'Glúteos', exercise: 'Elevação pélvica', reps: '4x12' },
];

const DEFAULT_WORKOUTS = {
  1: [{ muscle: 'Peito/Tríceps', exercise: 'Supino reto', reps: '4x10', load: '' }],
  2: [{ muscle: 'Costas/Bíceps', exercise: 'Puxada frontal', reps: '4x12', load: '' }],
  3: [{ muscle: 'Pernas', exercise: 'Agachamento livre', reps: '5x8', load: '' }],
  4: [{ muscle: 'Ombros', exercise: 'Desenvolvimento', reps: '4x10', load: '' }],
  5: [{ muscle: 'Posterior', exercise: 'Stiff', reps: '4x12', load: '' }],
  6: [{ muscle: 'HIIT', exercise: 'Circuito funcional', reps: '30 min', load: '' }],
};

const state = {
  measures: readStorage(STORAGE_KEYS.measures, []),
  workouts: readStorage(STORAGE_KEYS.workouts, DEFAULT_WORKOUTS),
  exerciseLibrary: readStorage(STORAGE_KEYS.exerciseLibrary, DEFAULT_LIBRARY),
};

const dom = {
  screens: document.querySelectorAll('.screen'),
  navButtons: document.querySelectorAll('.nav-btn'),
  screenTitle: document.getElementById('screenTitle'),
  modal: document.getElementById('measureModal'),
  measureForm: document.getElementById('measureForm'),
  measureTableBody: document.getElementById('measureTableBody'),
  workoutForm: document.getElementById('workoutForm'),
  presetSelect: document.getElementById('presetSelect'),
  saveWorkoutBtn: document.getElementById('saveWorkoutBtn'),
  workoutManagerModal: document.getElementById('workoutManagerModal'),
  workoutPlan: document.getElementById('workoutPlan'),
  exerciseLibrary: document.getElementById('exerciseLibrary'),
  weekStrip: document.getElementById('weekStrip'),
  weekSummary: document.getElementById('weekSummary'),
  todayWorkoutLabel: document.getElementById('todayWorkoutLabel'),
  todayWorkoutList: document.getElementById('todayWorkoutList'),
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
};

bindEvents();
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
  themeToggle: document.getElementById('themeToggle'),
};

bindEvents();
initTheme();
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
refreshAll();
window.addEventListener('resize', renderDashboard);

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value ?? structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.measures, JSON.stringify(state.measures));
  localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(state.workouts));
  localStorage.setItem(STORAGE_KEYS.exerciseLibrary, JSON.stringify(state.exerciseLibrary));
}

function bindEvents() {
  document.getElementById('openMeasureModal').onclick = () => dom.modal.showModal();
  document.getElementById('openMeasureModalHeader').onclick = () => dom.modal.showModal();
  document.getElementById('closeModal').onclick = () => dom.modal.close();
  document.getElementById('openWorkoutManager').onclick = () => dom.workoutManagerModal.showModal();
  document.getElementById('closeWorkoutManager').onclick = () => dom.workoutManagerModal.close();
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
=======
  dom.themeToggle.onclick = toggleTheme;
>>>>>>> theirs
=======
  dom.themeToggle.onclick = toggleTheme;
>>>>>>> theirs
=======
  dom.themeToggle.onclick = toggleTheme;
>>>>>>> theirs

  dom.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      dom.navButtons.forEach((b) => b.classList.remove('active'));
      dom.screens.forEach((s) => s.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.target).classList.add('active');
      dom.screenTitle.textContent = button.textContent;
    });
  });

  dom.measureForm.addEventListener('submit', onMeasureSubmit);
  dom.workoutForm.addEventListener('submit', onWorkoutSubmit);

  dom.presetSelect.addEventListener('change', () => {
    const chosen = state.exerciseLibrary.find((item) => item.id === dom.presetSelect.value);
    if (!chosen) return;
    dom.workoutForm.muscle.value = chosen.muscle;
    dom.workoutForm.exercise.value = chosen.exercise;
    dom.workoutForm.reps.value = chosen.reps;
  });
}

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initialTheme);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  renderDashboard();
}

function applyTheme(theme) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  dom.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
function onMeasureSubmit(event) {
  event.preventDefault();
  const form = new FormData(dom.measureForm);
  const entry = Object.fromEntries(form.entries());

  ['weight', 'height', 'neck', 'waist', 'hip', 'arm', 'leg'].forEach((field) => {
    entry[field] = entry[field] ? Number(entry[field]) : null;
  });

  state.measures.push(entry);
  state.measures.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveState();

  dom.measureForm.reset();
  dom.modal.close();
  refreshAll();
}

function onWorkoutSubmit(event) {
  event.preventDefault();
  const form = new FormData(dom.workoutForm);
  const day = Number(form.get('day'));
  const editDay = form.get('editDay');
  const editIndex = form.get('editIndex');

  const payload = {
    muscle: String(form.get('muscle')).trim(),
    exercise: String(form.get('exercise')).trim(),
    reps: String(form.get('reps')).trim(),
    load: '',
  };

  if (editDay !== '' && editIndex !== '') {
    const old = state.workouts[Number(editDay)][Number(editIndex)] || { load: '' };
    state.workouts[Number(editDay)][Number(editIndex)] = { ...payload, load: old.load };
  } else {
    state.workouts[day] = [...(state.workouts[day] || []), payload];
  }

  upsertExerciseLibrary(payload);
  resetWorkoutForm();
  saveState();
  refreshWorkoutArea();
}

function upsertExerciseLibrary(item) {
  const existing = state.exerciseLibrary.find((ex) => ex.exercise.toLowerCase() === item.exercise.toLowerCase());
  if (existing) {
    existing.muscle = item.muscle;
    existing.reps = item.reps;
    return;
  }

  state.exerciseLibrary.push({
    id: `ex-${Date.now()}`,
    muscle: item.muscle,
    exercise: item.exercise,
    reps: item.reps,
  });
}

function resetWorkoutForm() {
  dom.workoutForm.reset();
  dom.workoutForm.editDay.value = '';
  dom.workoutForm.editIndex.value = '';
  dom.saveWorkoutBtn.textContent = 'Adicionar exercício';
}

function refreshAll() {
  renderMeasuresTable();
  renderDashboard();
  refreshWorkoutArea();
}

function refreshWorkoutArea() {
  renderTodayWorkout();
  renderWeekStrip();
  renderWorkoutPlan();
  renderPresetOptions();
  renderExerciseLibrary();
}

function renderMeasuresTable() {
  dom.measureTableBody.innerHTML = '';
  if (!state.measures.length) {
    dom.measureTableBody.innerHTML = '<tr><td colspan="9">Nenhuma medida registrada ainda.</td></tr>';
    return;
  }

  state.measures.forEach((m, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.date || '-'}</td>
      <td>${m.weight ?? '-'}</td>
      <td>${m.height ?? '-'}</td>
      <td>${m.neck ?? '-'}</td>
      <td>${m.waist ?? '-'}</td>
      <td>${m.hip ?? '-'}</td>
      <td>${m.arm ?? '-'}</td>
      <td>${m.leg ?? '-'}</td>
      <td class="row-actions"><button class="trash-btn" data-measure-index="${index}" title="Excluir medida">🗑</button></td>
    `;
    dom.measureTableBody.appendChild(tr);
  });

  dom.measureTableBody.querySelectorAll('[data-measure-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.measures.splice(Number(btn.dataset.measureIndex), 1);
      saveState();
      refreshAll();
    });
  });
}

function renderDashboard() {
  const latest = state.measures.at(-1) || {};
  const fat = navyBodyFat(latest);
  const bmi = latest.weight && latest.height ? latest.weight / ((latest.height / 100) ** 2) : null;
  const lean = latest.weight && fat != null ? latest.weight * (1 - fat / 100) : null;

  setText('kpiWeight', latest.weight ? `${latest.weight} kg` : '-- kg');
  setText('kpiFat', fat != null ? `${fat}%` : '--%');
  setText('kpiHeight', latest.height ? `${latest.height} cm` : '-- cm');
  setText('kpiAge', calculateAge(latest.birthDate));
  setText('kpiBmi', bmi ? bmi.toFixed(1) : '--');
  setText('kpiLean', lean ? `${lean.toFixed(1)} kg` : '-- kg');
  setText('bodyFatValue', fat != null ? `${fat}%` : '--%');
  setText('bodyFatClass', classifyFat(fat));
  setGauge(fat);

  const weightSeries = state.measures.filter((m) => m.weight != null).map((m) => ({ x: m.date?.slice(5), y: m.weight }));
  const fatSeries = state.measures
    .map((m) => ({ x: m.date?.slice(5), y: navyBodyFat(m) }))
    .filter((m) => m.y != null);

  drawLineChart('weightChart', weightSeries, '#0f9d8b');
  drawLineChart('fatChart', fatSeries, '#4a78d6');
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function calculateAge(birthDate) {
  if (!birthDate) return '--';
  const today = new Date();
  const birth = new Date(birthDate);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years}a ${months}m ${days}d`;
}

function navyBodyFat({ sex, waist, neck, hip, height }) {
  if (!waist || !neck || !height) return null;

  if (sex === 'female') {
    if (!hip) return null;
    return Number((495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450).toFixed(1));
  }

  return Number((495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1));
}

function classifyFat(value) {
  if (value == null) return 'Sem dados';
  if (value < 10) return 'Atleta';
  if (value < 18) return 'Bom';
  if (value < 25) return 'Moderado';
  return 'Alto';
}

function setGauge(value) {
  const normalized = Math.max(0, Math.min(value || 0, 45));
  document.getElementById('gaugeProgress').style.strokeDashoffset = String(252 - (normalized / 45) * 252);
}

function drawLineChart(canvasId, points, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
=======
  const axisColor = getCssVar('--border');
  const labelColor = getCssVar('--muted');
>>>>>>> theirs
=======
  const axisColor = getCssVar('--border');
  const labelColor = getCssVar('--muted');
>>>>>>> theirs
=======
  const axisColor = getCssVar('--border');
  const labelColor = getCssVar('--muted');
>>>>>>> theirs
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth * ratio;
  const height = 180 * ratio;
  const pad = 24 * ratio;

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  if (points.length < 2) {
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
    ctx.fillStyle = '#8a949b';
=======
    ctx.fillStyle = labelColor;
>>>>>>> theirs
=======
    ctx.fillStyle = labelColor;
>>>>>>> theirs
=======
    ctx.fillStyle = labelColor;
>>>>>>> theirs
    ctx.font = `${14 * ratio}px sans-serif`;
    ctx.fillText('Adicione pelo menos 2 medições para ver o gráfico', pad, height / 2);
    return;
  }

  const values = points.map((p) => p.y);
  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  ctx.strokeStyle = '#d7dfe3';
=======
  ctx.strokeStyle = axisColor;
>>>>>>> theirs
=======
  ctx.strokeStyle = axisColor;
>>>>>>> theirs
=======
  ctx.strokeStyle = axisColor;
>>>>>>> theirs
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, height - pad);
  ctx.lineTo(width - pad, height - pad);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();

  points.forEach((point, index) => {
    const x = pad + ((width - 2 * pad) * index) / (points.length - 1);
    const y = height - pad - ((point.y - min) / (max - min || 1)) * (height - 2 * pad);

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4 * ratio, 0, Math.PI * 2);
    ctx.fill();

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
    ctx.fillStyle = '#6f7981';
=======
    ctx.fillStyle = labelColor;
>>>>>>> theirs
=======
    ctx.fillStyle = labelColor;
>>>>>>> theirs
=======
    ctx.fillStyle = labelColor;
>>>>>>> theirs
    ctx.font = `${10 * ratio}px sans-serif`;
    ctx.fillText(point.x || '', x - 15, height - 6);
  });

  ctx.stroke();
}

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
function getCssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
function dayName(day) {
  return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day];
}

function renderWeekStrip() {
  const today = new Date().getDay();
  const activeDays = [1, 2, 3, 4, 5, 6].filter((d) => (state.workouts[d] || []).length > 0).length;

  dom.weekStrip.innerHTML = [0, 1, 2, 3, 4, 5, 6]
    .map((day) => {
      const count = day === 0 ? 'REST' : (state.workouts[day] || []).length;
      const classes = `week-day ${day === today ? 'today' : ''} ${day === 0 ? 'rest' : ''}`;
      return `<div class="${classes}">${dayName(day).slice(0, 3)}<strong>${count}</strong></div>`;
    })
    .join('');

  dom.weekSummary.textContent = `${activeDays} de 6 dias com treino cadastrado nesta semana.`;
}

function renderTodayWorkout() {
  const today = new Date().getDay();

  if (today === 0) {
    dom.todayWorkoutLabel.textContent = 'Hoje é domingo: descanso ativo 🧘';
    dom.todayWorkoutList.innerHTML = '<p class="muted">Aproveite para recuperação, mobilidade e hidratação.</p>';
    return;
  }

  const list = state.workouts[today] || [];
  dom.todayWorkoutLabel.textContent = `${dayName(today)} · ${list[0]?.muscle || 'Treino sem grupo definido'}`;

  dom.todayWorkoutList.innerHTML = list.length
    ? list
        .map(
          (item, index) => `
      <div class="workout-item">
        <div>
          <strong>${item.exercise}</strong>
          <div class="muted">${item.reps}</div>
        </div>
        <label>Carga (kg)
          <input type="number" step="0.5" value="${item.load || ''}" data-load-day="${today}" data-load-index="${index}" />
        </label>
      </div>
    `,
        )
        .join('')
    : '<p class="muted">Nenhum exercício cadastrado para hoje.</p>';

  dom.todayWorkoutList.querySelectorAll('[data-load-day]').forEach((input) => {
    input.addEventListener('change', () => {
      const day = Number(input.dataset.loadDay);
      const index = Number(input.dataset.loadIndex);
      state.workouts[day][index].load = input.value;
      saveState();
    });
  });
}

function renderWorkoutPlan() {
  dom.workoutPlan.className = 'workout-plan-grid';
  dom.workoutPlan.innerHTML = Object.entries(state.workouts)
    .map(([day, items]) => {
      const list = items.length
        ? items
            .map(
              (item, index) => `
                <li>
                  <strong>${item.exercise}</strong> • ${item.reps}
                  <span class="muted">(${item.muscle})</span>
                  <span class="button-group">
                    <button class="action-btn" data-edit-day="${day}" data-edit-index="${index}">Editar</button>
                    <button class="trash-btn" data-remove-day="${day}" data-remove-index="${index}">🗑</button>
                  </span>
                </li>
              `,
            )
            .join('')
        : '<li>Sem exercícios</li>';

      return `<details class="workout-day-card"><summary>${dayName(Number(day))} (${items.length})</summary><ul>${list}</ul></details>`;
    })
    .join('');

  dom.workoutPlan.querySelectorAll('[data-remove-day]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const day = Number(btn.dataset.removeDay);
      const index = Number(btn.dataset.removeIndex);
      state.workouts[day].splice(index, 1);
      saveState();
      refreshWorkoutArea();
    });
  });

  dom.workoutPlan.querySelectorAll('[data-edit-day]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const day = Number(btn.dataset.editDay);
      const index = Number(btn.dataset.editIndex);
      const item = state.workouts[day][index];
      dom.workoutForm.day.value = String(day);
      dom.workoutForm.muscle.value = item.muscle;
      dom.workoutForm.exercise.value = item.exercise;
      dom.workoutForm.reps.value = item.reps;
      dom.workoutForm.editDay.value = String(day);
      dom.workoutForm.editIndex.value = String(index);
      dom.saveWorkoutBtn.textContent = 'Salvar edição';
    });
  });
}

function renderPresetOptions() {
  dom.presetSelect.innerHTML = '<option value="">Selecionar exercício já cadastrado</option>';
  dom.presetSelect.innerHTML += state.exerciseLibrary
    .map((ex) => `<option value="${ex.id}">${ex.exercise} · ${ex.muscle} · ${ex.reps}</option>`)
    .join('');
}

function renderExerciseLibrary() {
  dom.exerciseLibrary.className = 'library-list';
  dom.exerciseLibrary.innerHTML = state.exerciseLibrary
    .map(
      (item) => `
        <div class="library-item">
          <div>
            <strong>${item.exercise}</strong>
            <span class="muted">${item.muscle} · ${item.reps}</span>
          </div>
          <div class="button-group">
            <button class="action-btn" data-lib-use="${item.id}">Usar/Editar</button>
            <button class="trash-btn" data-lib-delete="${item.id}">🗑</button>
          </div>
        </div>
      `,
    )
    .join('');

  dom.exerciseLibrary.querySelectorAll('[data-lib-use]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = state.exerciseLibrary.find((ex) => ex.id === btn.dataset.libUse);
      if (!item) return;
      dom.workoutForm.muscle.value = item.muscle;
      dom.workoutForm.exercise.value = item.exercise;
      dom.workoutForm.reps.value = item.reps;
    });
  });

  dom.exerciseLibrary.querySelectorAll('[data-lib-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.exerciseLibrary = state.exerciseLibrary.filter((ex) => ex.id !== btn.dataset.libDelete);
      saveState();
      renderPresetOptions();
      renderExerciseLibrary();
    });
  });
}

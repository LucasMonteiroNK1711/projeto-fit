const STORAGE_KEYS = {
  measures: 'fit_tracker_measures',
  workouts: 'fit_tracker_workouts',
};

const defaultWorkouts = {
  1: [{ muscle: 'Peito/Tríceps', exercise: 'Supino reto', reps: '4x10', load: '' }],
  2: [{ muscle: 'Costas/Bíceps', exercise: 'Remada curvada', reps: '4x12', load: '' }],
  3: [{ muscle: 'Pernas', exercise: 'Agachamento livre', reps: '5x8', load: '' }],
  4: [{ muscle: 'Ombros/Core', exercise: 'Desenvolvimento', reps: '4x10', load: '' }],
  5: [{ muscle: 'Posterior/Glúteos', exercise: 'Stiff', reps: '4x12', load: '' }],
  6: [{ muscle: 'Full body/HIIT', exercise: 'Circuito funcional', reps: '30 min', load: '' }],
};

const state = {
  measures: JSON.parse(localStorage.getItem(STORAGE_KEYS.measures) || '[]'),
  workouts: JSON.parse(localStorage.getItem(STORAGE_KEYS.workouts) || 'null') || defaultWorkouts,
};

const navButtons = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');
const screenTitle = document.getElementById('screenTitle');
const modal = document.getElementById('measureModal');
const measureForm = document.getElementById('measureForm');
const tableBody = document.getElementById('measureTableBody');
const workoutForm = document.getElementById('workoutForm');

function saveMeasures() {
  localStorage.setItem(STORAGE_KEYS.measures, JSON.stringify(state.measures));
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(state.workouts));
}

document.getElementById('openMeasureModal').onclick = () => modal.showModal();
document.getElementById('openMeasureModalHeader').onclick = () => modal.showModal();
document.getElementById('closeModal').onclick = () => modal.close();

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    navButtons.forEach((b) => b.classList.remove('active'));
    screens.forEach((s) => s.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');
    screenTitle.textContent = button.textContent;
  });
});

measureForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fd = new FormData(measureForm);
  const entry = Object.fromEntries(fd.entries());

  Object.keys(entry).forEach((key) => {
    if (['date', 'sex', 'birthDate'].includes(key)) return;
    entry[key] = entry[key] ? Number(entry[key]) : null;
  });

  state.measures.push(entry);
  state.measures.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveMeasures();

  measureForm.reset();
  modal.close();
  refreshAll();
});

workoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fd = new FormData(workoutForm);
  const day = Number(fd.get('day'));
  const newItem = {
    muscle: fd.get('muscle'),
    exercise: fd.get('exercise'),
    reps: fd.get('reps'),
    load: '',
  };

  state.workouts[day] = [...(state.workouts[day] || []), newItem];
  saveWorkouts();
  workoutForm.reset();
  renderWorkoutPlan();
  renderTodayWorkout();
  renderWeekStrip();
});

function calculateAge(birthDate) {
  if (!birthDate) return '--';
  const today = new Date();
  const b = new Date(birthDate);
  let years = today.getFullYear() - b.getFullYear();
  let months = today.getMonth() - b.getMonth();
  let days = today.getDate() - b.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years}a ${months}m ${days}d`;
}

function navyBodyFat(latest) {
  const { sex, waist, neck, hip, height } = latest;
  if (!waist || !neck || !height) return null;
  if (sex === 'female') {
    if (!hip) return null;
    const value = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    return Number(value.toFixed(1));
  }
  const value = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  return Number(value.toFixed(1));
}

function fatClass(pct) {
  if (pct == null) return 'Sem dados';
  if (pct < 10) return 'Atleta';
  if (pct < 18) return 'Bom';
  if (pct < 25) return 'Moderado';
  return 'Alto';
}

function setGauge(value) {
  const pct = Math.max(0, Math.min(value || 0, 45));
  const path = document.getElementById('gaugeProgress');
  const total = 252;
  path.style.strokeDashoffset = String(total - (pct / 45) * total);
}

function drawLineChart(canvasId, labels, values, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth * window.devicePixelRatio;
  const h = canvas.height = 180 * window.devicePixelRatio;
  const pad = 24 * window.devicePixelRatio;
  ctx.clearRect(0, 0, w, h);

  if (values.length < 2) {
    ctx.fillStyle = '#8a949b';
    ctx.font = `${14 * window.devicePixelRatio}px sans-serif`;
    ctx.fillText('Adicione pelo menos 2 medições para ver o gráfico', pad, h / 2);
    return;
  }

  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;

  ctx.strokeStyle = '#d7dfe3';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, h - pad);
  ctx.lineTo(w - pad, h - pad);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();

  values.forEach((value, index) => {
    const x = pad + ((w - 2 * pad) * index) / (values.length - 1);
    const y = h - pad - ((value - min) / (max - min || 1)) * (h - 2 * pad);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4 * window.devicePixelRatio, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6f7981';
    ctx.font = `${10 * window.devicePixelRatio}px sans-serif`;
    ctx.fillText(labels[index], x - 15, h - 6);
  });
  ctx.stroke();
}

function deleteMeasure(index) {
  state.measures.splice(index, 1);
  saveMeasures();
  refreshAll();
}

function renderMeasures() {
  tableBody.innerHTML = '';
  if (!state.measures.length) {
    tableBody.innerHTML = '<tr><td colspan="9">Nenhuma medida registrada ainda.</td></tr>';
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
      <td class="row-actions"><button class="trash-btn" data-measure-index="${index}" title="Excluir medida">🗑</button></td>`;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll('[data-measure-index]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const idx = Number(event.currentTarget.dataset.measureIndex);
      deleteMeasure(idx);
    });
  });
}

function renderDashboard() {
  const latest = state.measures[state.measures.length - 1] || {};
  const fat = navyBodyFat(latest);
  const age = calculateAge(latest.birthDate);
  const bmi = latest.weight && latest.height ? latest.weight / ((latest.height / 100) ** 2) : null;
  const lean = latest.weight && fat != null ? latest.weight * (1 - fat / 100) : null;

  document.getElementById('kpiWeight').textContent = latest.weight ? `${latest.weight} kg` : '-- kg';
  document.getElementById('kpiFat').textContent = fat != null ? `${fat}%` : '--%';
  document.getElementById('kpiHeight').textContent = latest.height ? `${latest.height} cm` : '-- cm';
  document.getElementById('kpiAge').textContent = age;
  document.getElementById('kpiBmi').textContent = bmi ? bmi.toFixed(1) : '--';
  document.getElementById('kpiLean').textContent = lean ? `${lean.toFixed(1)} kg` : '-- kg';
  document.getElementById('bodyFatValue').textContent = fat != null ? `${fat}%` : '--%';
  document.getElementById('bodyFatClass').textContent = fatClass(fat);
  setGauge(fat);

  const weightMeasures = state.measures.filter((m) => m.weight != null);
  const fatMeasures = state.measures.map((m) => ({ date: m.date, fat: navyBodyFat(m) })).filter((m) => m.fat != null);

  drawLineChart('weightChart', weightMeasures.map((m) => m.date?.slice(5) || ''), weightMeasures.map((m) => m.weight), '#0f9d8b');
  drawLineChart('fatChart', fatMeasures.map((m) => m.date?.slice(5) || ''), fatMeasures.map((m) => m.fat), '#4a78d6');
}

function dayName(day) {
  return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day];
}

function renderWeekStrip() {
  const strip = document.getElementById('weekStrip');
  const summary = document.getElementById('weekSummary');
  const today = new Date().getDay();
  const activeDays = [1, 2, 3, 4, 5, 6].filter((day) => (state.workouts[day] || []).length > 0).length;

  strip.innerHTML = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const cls = [day === today ? 'today' : '', day === 0 ? 'rest' : ''].join(' ');
    const count = (state.workouts[day] || []).length;
    const short = dayName(day).slice(0, 3);
    return `<div class="week-day ${cls}">${short}<strong>${day === 0 ? 'REST' : count}</strong></div>`;
  }).join('');

  summary.textContent = `${activeDays} de 6 dias com treino cadastrado nesta semana.`;
}

function renderTodayWorkout() {
  const today = new Date().getDay();
  const label = document.getElementById('todayWorkoutLabel');
  const box = document.getElementById('todayWorkoutList');

  if (today === 0) {
    label.textContent = 'Hoje é domingo: descanso ativo 🧘';
    box.innerHTML = '<p class="muted">Aproveite para recuperação, mobilidade e hidratação.</p>';
    return;
  }

  const list = state.workouts[today] || [];
  label.textContent = `${dayName(today)} · ${list[0]?.muscle || 'Treino sem grupo definido'}`;

  box.innerHTML = list.length
    ? list.map((item, index) => `
      <div class="workout-item">
        <div>
          <strong>${item.exercise}</strong>
          <div class="muted">${item.reps}</div>
        </div>
        <label>Carga (kg)
          <input type="number" step="0.5" value="${item.load || ''}" data-day="${today}" data-index="${index}" class="load-input" />
        </label>
      </div>`).join('')
    : '<p class="muted">Nenhum exercício cadastrado para hoje.</p>';

  document.querySelectorAll('.load-input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const day = Number(e.target.dataset.day);
      const index = Number(e.target.dataset.index);
      state.workouts[day][index].load = e.target.value;
      saveWorkouts();
    });
  });
}

function removeExercise(day, index) {
  state.workouts[day].splice(index, 1);
  saveWorkouts();
  renderWorkoutPlan();
  renderTodayWorkout();
  renderWeekStrip();
}

function renderWorkoutPlan() {
  const root = document.getElementById('workoutPlan');
  root.className = 'workout-plan-grid';

  root.innerHTML = Object.entries(state.workouts)
    .map(([day, items]) => {
      const title = dayName(Number(day));
      const exercises = items.length
        ? items.map((item, idx) => `<li><strong>${item.exercise}</strong> • ${item.reps} <span class="muted">(${item.muscle})</span> <button class="trash-btn" data-day="${day}" data-ex-index="${idx}">🗑</button></li>`).join('')
        : '<li>Sem exercícios</li>';
      return `<details class="workout-day-card"><summary>${title} (${items.length})</summary><ul>${exercises}</ul></details>`;
    })
    .join('');

  document.querySelectorAll('[data-ex-index]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const day = Number(event.currentTarget.dataset.day);
      const index = Number(event.currentTarget.dataset.exIndex);
      removeExercise(day, index);
    });
  });
}

function refreshAll() {
  renderMeasures();
  renderDashboard();
  renderTodayWorkout();
  renderWorkoutPlan();
  renderWeekStrip();
}

refreshAll();
window.addEventListener('resize', renderDashboard);

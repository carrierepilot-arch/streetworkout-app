/* ========================================
   DASHBOARD.JS — Dashboard Logic (Stats, Level, Chart)
   ======================================== */

/* Level calculation */
function calculateLevel(data) {
  var score = 0;

  if (data.pullups >= 15) score += 25;
  else if (data.pullups >= 8) score += 15;
  else if (data.pullups >= 3) score += 8;

  if (data.dips >= 20) score += 20;
  else if (data.dips >= 10) score += 12;
  else if (data.dips >= 5) score += 6;

  if (data.pushups >= 40) score += 20;
  else if (data.pushups >= 20) score += 12;
  else if (data.pushups >= 10) score += 6;

  if (data.squats >= 60) score += 15;
  else if (data.squats >= 30) score += 9;
  else if (data.squats >= 15) score += 5;

  if (data.muscleup === 'oui') score += 20;

  if (score >= 65) return { level: 'Avancé', color: '#00FF87', icon: '🔥', score: score };
  if (score >= 30) return { level: 'Intermédiaire', color: '#00B4FF', icon: '⚡', score: score };
  return { level: 'Débutant', color: '#FF6B35', icon: '🌱', score: score };
}

/* Get recommended targets based on level */
function getTargets(levelName) {
  if (levelName === 'Avancé') {
    return { pullups: 20, dips: 25, pushups: 50, squats: 80 };
  }
  if (levelName === 'Intermédiaire') {
    return { pullups: 15, dips: 20, pushups: 40, squats: 60 };
  }
  return { pullups: 8, dips: 10, pushups: 20, squats: 30 };
}

/* Initialize dashboard */
function initDashboard() {
  if (!requireAuth()) return;

  loadProfile();
  loadFormData();
  updateStatsCards();
  renderChart();

  /* Save button handler */
  var saveBtn = document.getElementById('save-data');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveFormData);
  }

  /* Profile name editing */
  var editNameBtn = document.getElementById('edit-name-btn');
  var nameDisplay = document.getElementById('profile-name-display');
  var nameInput = document.getElementById('profile-name-input');
  var saveNameBtn = document.getElementById('save-name-btn');

  if (editNameBtn) {
    editNameBtn.addEventListener('click', function() {
      nameDisplay.style.display = 'none';
      editNameBtn.style.display = 'none';
      nameInput.style.display = 'block';
      saveNameBtn.style.display = 'inline-flex';
      nameInput.value = nameDisplay.textContent;
      nameInput.focus();
    });
  }

  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', function() {
      var name = nameInput.value.trim() || 'Athlète';
      SW.save('profile_name', name);
      nameDisplay.textContent = name;
      nameDisplay.style.display = 'block';
      editNameBtn.style.display = 'inline-flex';
      nameInput.style.display = 'none';
      saveNameBtn.style.display = 'none';
      updateAvatar(name);
      showToast('Nom mis à jour !');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveNameBtn.click();
      }
    });
  }

  /* Logout buttons */
  document.querySelectorAll('[data-action="logout"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  });
}

/* Load profile name */
function loadProfile() {
  var name = SW.load('profile_name') || 'Athlète';
  var nameDisplay = document.getElementById('profile-name-display');
  if (nameDisplay) nameDisplay.textContent = name;
  updateAvatar(name);
}

/* Update avatar with initials */
function updateAvatar(name) {
  var avatar = document.getElementById('profile-avatar');
  if (!avatar) return;
  var parts = name.trim().split(/\s+/);
  var initials = parts.map(function(p) { return p.charAt(0).toUpperCase(); }).join('').substring(0, 2);
  avatar.textContent = initials || 'A';
}

/* Load saved form data into inputs */
function loadFormData() {
  var data = SW.load('user_data');
  if (!data) return;

  var fields = ['weight', 'pullups', 'dips', 'pushups', 'squats'];
  fields.forEach(function(f) {
    var input = document.getElementById('input-' + f);
    if (input && data[f] !== undefined) {
      input.value = data[f];
    }
  });

  /* Muscle-up radio */
  if (data.muscleup) {
    var radio = document.querySelector('input[name="muscleup"][value="' + data.muscleup + '"]');
    if (radio) radio.checked = true;
  }
}

/* Save form data */
function saveFormData() {
  var data = {
    weight: parseFloat(document.getElementById('input-weight').value) || 0,
    pullups: parseInt(document.getElementById('input-pullups').value) || 0,
    dips: parseInt(document.getElementById('input-dips').value) || 0,
    pushups: parseInt(document.getElementById('input-pushups').value) || 0,
    squats: parseInt(document.getElementById('input-squats').value) || 0,
    muscleup: (document.querySelector('input[name="muscleup"]:checked') || {}).value || 'non',
    date: new Date().toISOString()
  };

  /* Save current data */
  SW.save('user_data', data);

  /* Append to history */
  var history = SW.load('user_history') || [];
  history.push({
    pullups: data.pullups,
    dips: data.dips,
    pushups: data.pushups,
    squats: data.squats,
    weight: data.weight,
    date: data.date
  });
  /* Keep last 30 entries */
  if (history.length > 30) history = history.slice(-30);
  SW.save('user_history', history);

  updateStatsCards();
  renderChart();
  showToast('Données sauvegardées !');
}

/* Update stats cards and level */
function updateStatsCards() {
  var data = SW.load('user_data');
  if (!data) {
    document.getElementById('level-badge').textContent = '🌱 Débutant';
    document.getElementById('level-badge').style.color = '#FF6B35';
    return;
  }

  var result = calculateLevel(data);
  var targets = getTargets(result.level);

  /* Update level badge */
  var badge = document.getElementById('level-badge');
  if (badge) {
    badge.textContent = result.icon + ' ' + result.level;
    badge.style.color = result.color;
    badge.style.borderColor = result.color;
    badge.style.background = result.color + '18';
    badge.classList.add('badge-bounce');
    setTimeout(function() { badge.classList.remove('badge-bounce'); }, 600);
  }

  /* Update score */
  var scoreEl = document.getElementById('score-value');
  if (scoreEl) scoreEl.textContent = result.score + '/100';

  /* Update each stat card */
  var exercises = [
    { key: 'pullups', label: 'Tractions', target: targets.pullups },
    { key: 'dips', label: 'Dips', target: targets.dips },
    { key: 'pushups', label: 'Pompes', target: targets.pushups },
    { key: 'squats', label: 'Squats', target: targets.squats }
  ];

  exercises.forEach(function(ex) {
    var valueEl = document.getElementById('stat-' + ex.key + '-value');
    var barEl = document.getElementById('stat-' + ex.key + '-bar');
    var targetEl = document.getElementById('stat-' + ex.key + '-target');

    if (valueEl) valueEl.textContent = data[ex.key] || 0;
    if (targetEl) targetEl.textContent = 'Objectif : ' + ex.target + ' reps';
    if (barEl) {
      var pct = Math.min(((data[ex.key] || 0) / ex.target) * 100, 100);
      barEl.style.width = pct + '%';
    }
  });
}

/* Render SVG chart for pullups history */
function renderChart() {
  var container = document.getElementById('chart-container');
  if (!container) return;

  var history = SW.load('user_history');
  if (!history || history.length < 2) {
    container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-muted);">' +
      '<p style="font-size:1.1rem;margin-bottom:8px;">📊</p>' +
      '<p>Sauvegarde tes premières données pour voir ta progression.</p>' +
      '<p style="font-size:0.8rem;margin-top:4px;">Au moins 2 sauvegardes nécessaires.</p></div>';
    return;
  }

  var width = container.clientWidth || 600;
  var height = 220;
  var padX = 40;
  var padY = 20;

  /* Build data arrays */
  var pullData = history.map(function(h) { return h.pullups || 0; });
  var dipsData = history.map(function(h) { return h.dips || 0; });

  var allValues = pullData.concat(dipsData);
  var maxVal = Math.max.apply(null, allValues) || 1;
  maxVal = Math.ceil(maxVal * 1.15);

  var stepX = (width - padX * 2) / (history.length - 1);

  function toPoint(data, i) {
    var x = padX + i * stepX;
    var y = height - padY - ((data[i] / maxVal) * (height - padY * 2));
    return { x: x, y: y };
  }

  function buildPath(data) {
    var points = data.map(function(_, i) { return toPoint(data, i); });
    return points.map(function(p, i) {
      return (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1);
    }).join(' ');
  }

  /* Grid lines */
  var gridLines = '';
  for (var g = 0; g <= 4; g++) {
    var gy = padY + (g / 4) * (height - padY * 2);
    var gVal = Math.round(maxVal - (g / 4) * maxVal);
    gridLines += '<line x1="' + padX + '" y1="' + gy + '" x2="' + (width - padX) + '" y2="' + gy + '" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>';
    gridLines += '<text x="' + (padX - 8) + '" y="' + (gy + 4) + '" fill="' + 'var(--text-muted)' + '" font-size="10" text-anchor="end">' + gVal + '</text>';
  }

  /* Dots */
  var pullDots = pullData.map(function(_, i) {
    var p = toPoint(pullData, i);
    return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4" fill="#00FF87"/>';
  }).join('');

  var dipsDots = dipsData.map(function(_, i) {
    var p = toPoint(dipsData, i);
    return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4" fill="#00B4FF"/>';
  }).join('');

  var svg = '<svg width="100%" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none">' +
    gridLines +
    '<path d="' + buildPath(pullData) + '" fill="none" stroke="#00FF87" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + buildPath(dipsData) + '" fill="none" stroke="#00B4FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    pullDots + dipsDots +
    '<circle cx="' + (width - padX - 60) + '" cy="12" r="5" fill="#00FF87"/>' +
    '<text x="' + (width - padX - 50) + '" y="16" fill="var(--text-secondary)" font-size="11">Tractions</text>' +
    '<circle cx="' + (width - padX - 60) + '" cy="28" r="5" fill="#00B4FF"/>' +
    '<text x="' + (width - padX - 50) + '" y="32" fill="var(--text-secondary)" font-size="11">Dips</text>' +
    '</svg>';

  container.innerHTML = svg;
}

/* Run on DOM ready */
document.addEventListener('DOMContentLoaded', initDashboard);

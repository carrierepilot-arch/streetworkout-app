/* ═══════════════════════════════════════════════════════
   ENTRAÎNEMENT — js/entrainement.js
   Objectif, Planning, Calendrier, Programme, Test, Séances
   ═══════════════════════════════════════════════════════ */

var SW_ENTRAINEMENT = (function() {

  var calYear, calMonth;

  /* ── Test exercice config ── */
  var TEST_EXERCISES = [
    { id: 'tractions', nom: 'Tractions',  unite: 'reps',     duree: 60,  max: 50,  poids: 0.40 },
    { id: 'dips',      nom: 'Dips',       unite: 'reps',     duree: 60,  max: 40,  poids: 0.25 },
    { id: 'pompes',    nom: 'Pompes',     unite: 'reps',     duree: 60,  max: 80,  poids: 0.20 },
    { id: 'gainage',   nom: 'Gainage',    unite: 'secondes', duree: 120, max: 300, poids: 0.15 }
  ];
  var REST_DEFAULT = 240; // 4 minutes

  function init() {
    initObjectif();
    initPlanning();
    initCalendar();
    initLevel();
    initTestModal();
    bindGenerate();
    recalculerNiveau();
  }

  /* ═══════ A. OBJECTIF ═══════ */
  function initObjectif() {
    var profil = SW_STORAGE.load('sw_profil') || {};
    var cards = document.querySelectorAll('.obj-card');
    cards.forEach(function(c) {
      if (c.dataset.obj === profil.objectif) c.classList.add('active');
      c.addEventListener('click', function() {
        cards.forEach(function(x) { x.classList.remove('active'); });
        c.classList.add('active');
        SW_STORAGE.update('sw_profil', { objectif: c.dataset.obj });
        refreshGenerateBtn();
      });
    });
  }

  /* ═══════ B. PLANNING ═══════ */
  function initPlanning() {
    var profil = SW_STORAGE.load('sw_profil') || {};
    var pills = document.querySelectorAll('.freq-pill');
    var daysRow = document.getElementById('days-row');
    var dayBtns = daysRow ? daysRow.querySelectorAll('.day-check') : [];

    var savedFreq = profil.frequence || 0;
    var savedDays = profil.jours || [];

    pills.forEach(function(p) {
      if (parseInt(p.dataset.freq) === savedFreq) p.classList.add('active');
      p.addEventListener('click', function() {
        pills.forEach(function(x) { x.classList.remove('active'); });
        p.classList.add('active');
        var freq = parseInt(p.dataset.freq);
        enableDays(freq);
      });
    });

    if (savedFreq > 0) enableDays(savedFreq);

    dayBtns.forEach(function(d) {
      if (savedDays.indexOf(d.dataset.day) !== -1) d.classList.add('active');
      d.addEventListener('click', function() {
        if (d.classList.contains('disabled')) return;
        var freq = getSelectedFreq();
        var activeDays = daysRow.querySelectorAll('.day-check.active');
        if (!d.classList.contains('active') && activeDays.length >= freq) return;
        d.classList.toggle('active');
        saveDays();
        refreshGenerateBtn();
      });
    });

    function enableDays(freq) {
      dayBtns.forEach(function(d) {
        d.classList.remove('disabled', 'active');
      });
      SW_STORAGE.update('sw_profil', { frequence: freq, jours: [] });
      refreshGenerateBtn();
    }

    function getSelectedFreq() {
      var active = document.querySelector('.freq-pill.active');
      return active ? parseInt(active.dataset.freq) : 0;
    }

    function saveDays() {
      var sel = [];
      daysRow.querySelectorAll('.day-check.active').forEach(function(d) {
        sel.push(d.dataset.day);
      });
      SW_STORAGE.update('sw_profil', { jours: sel });
    }
  }

  function refreshGenerateBtn() {
    var btn = document.getElementById('btn-generate');
    if (!btn) return;
    var profil = SW_STORAGE.load('sw_profil') || {};
    var ok = profil.objectif && profil.jours && profil.jours.length > 0 &&
             profil.frequence && profil.jours.length === profil.frequence;
    btn.disabled = !ok;
  }

  /* ═══════ C. CALENDRIER ═══════ */
  function initCalendar() {
    var now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    renderCalendar();

    var prev = document.getElementById('cal-prev');
    var next = document.getElementById('cal-next');
    if (prev) prev.addEventListener('click', function() {
      calMonth--;
      if (calMonth < 0) { calMonth = 11; calYear--; }
      renderCalendar();
    });
    if (next) next.addEventListener('click', function() {
      calMonth++;
      if (calMonth > 11) { calMonth = 0; calYear++; }
      renderCalendar();
    });
  }

  function renderCalendar() {
    var title = document.getElementById('cal-title');
    var grid = document.getElementById('cal-grid');
    if (!title || !grid) return;

    var months = ['Janvier','Février','Mars','Avril','Mai','Juin',
                  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    title.textContent = months[calMonth] + ' ' + calYear;

    var seances = SW_STORAGE.load('sw_seances') || [];
    var seanceDates = {};
    seances.forEach(function(s) {
      if (s.statut === 'effectuee' && s.date) seanceDates[s.date] = true;
    });

    var first = new Date(calYear, calMonth, 1);
    var startDay = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    var today = new Date();
    var todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    var html = '';
    for (var e = 0; e < startDay; e++) {
      html += '<div class="cal-day empty"></div>';
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = calYear + '-' +
        String(calMonth + 1).padStart(2, '0') + '-' +
        String(d).padStart(2, '0');
      var cls = 'cal-day';
      if (dateStr === todayStr) cls += ' today';
      if (seanceDates[dateStr]) cls += ' done';
      html += '<div class="' + cls + '">' + d + '</div>';
    }
    grid.innerHTML = html;
  }

  /* ═══════ C2. LEVEL ═══════ */
  function initLevel() {
    renderLevel();
  }

  function renderLevel() {
    var profil = SW_STORAGE.load('sw_profil') || {};
    var niv = profil.niveau || 'Débutant';

    var seances = SW_STORAGE.load('sw_seances') || [];
    var done = seances.filter(function(s) { return s.statut === 'effectuee'; }).length;

    var levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
    var idx = levels.indexOf(niv);
    if (idx < 0) idx = 0;
    var pct = ((idx) / 3) * 100;

    var next = idx < 3 ? levels[idx + 1] : null;

    var badge = document.getElementById('level-badge');
    var bar = document.getElementById('level-bar');
    var info = document.getElementById('level-info');

    if (badge) badge.textContent = niv;
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
    if (info) info.textContent = next
      ? 'Continue pour atteindre ' + next
      : 'Niveau maximum atteint !';
  }

  /* ═══════ RECALCULER NIVEAU ═══════ */
  function recalculerNiveau() {
    var testData = SW_STORAGE.load('sw_test');
    var seances = SW_STORAGE.load('sw_seances') || [];
    var done = seances.filter(function(s) { return s.statut === 'effectuee'; }).length;

    var niv;

    if (testData && typeof testData.score === 'number') {
      /* Priority 1: test score */
      var score = testData.score;
      if      (score >= 90) niv = 'Expert';
      else if (score >= 65) niv = 'Avancé';
      else if (score >= 35) niv = 'Intermédiaire';
      else                  niv = 'Débutant';
    } else {
      /* Priority 2: session count */
      if      (done >= 31) niv = 'Expert';
      else if (done >= 16) niv = 'Avancé';
      else if (done >= 6)  niv = 'Intermédiaire';
      else                 niv = 'Débutant';
    }

    SW_STORAGE.update('sw_profil', { niveau: niv });
    renderLevel();
    SW_PROFIL.renderStats();
  }

  /* ═══════ C3. TEST DE NIVEAU (interactif chronométré) ═══════ */
  var testState = {};

  function initTestModal() {
    var openBtn = document.getElementById('btn-open-test');
    var overlay = document.getElementById('test-overlay');
    var closeBtn = document.getElementById('test-close');

    if (!openBtn || !overlay) return;

    openBtn.addEventListener('click', function() { ouvrirTest(); });
    closeBtn.addEventListener('click', function() { fermerTest(); });

    /* Intro start */
    var startBtn = document.getElementById('test-btn-start');
    if (startBtn) startBtn.addEventListener('click', function() { lancerExercice(0); });

    /* Score next */
    var nextBtn = document.getElementById('test-btn-next');
    if (nextBtn) nextBtn.addEventListener('click', function() { validerScore(); });

    /* Rest controls */
    var minusBtn = document.getElementById('rest-minus');
    var plusBtn = document.getElementById('rest-plus');
    var skipBtn = document.getElementById('rest-skip');
    if (minusBtn) minusBtn.addEventListener('click', function() { ajusterRepos(-60); });
    if (plusBtn)  plusBtn.addEventListener('click', function()  { ajusterRepos(60); });
    if (skipBtn)  skipBtn.addEventListener('click', function()  { skipRepos(); });

    /* Results close */
    var resultsClose = document.getElementById('results-close');
    if (resultsClose) resultsClose.addEventListener('click', function() { fermerTest(); });
  }

  function ouvrirTest() {
    var overlay = document.getElementById('test-overlay');
    if (!overlay) return;

    testState = { exIndex: 0, scores: {}, timerId: null, restTimerId: null, restSeconds: 0 };

    /* Build intro exercises list */
    var list = document.getElementById('test-exercises-list');
    if (list) {
      var html = '';
      TEST_EXERCISES.forEach(function(ex) {
        html += '<div class="test-ex-item"><span>' + esc(ex.nom) + '</span><span>' +
                ex.duree + 's — ' + ex.unite + '</span></div>';
      });
      list.innerHTML = html;
    }

    showTestScreen('intro');
    overlay.classList.add('open');
  }

  function fermerTest() {
    var overlay = document.getElementById('test-overlay');
    if (overlay) overlay.classList.remove('open');
    if (testState.timerId) clearInterval(testState.timerId);
    if (testState.restTimerId) clearInterval(testState.restTimerId);
    testState = {};
  }

  function showTestScreen(name) {
    var screens = document.querySelectorAll('.test-screen');
    screens.forEach(function(s) { s.classList.remove('active'); });
    var target = document.getElementById('test-screen-' + name);
    if (target) target.classList.add('active');
  }

  function lancerExercice(index) {
    testState.exIndex = index;
    var ex = TEST_EXERCISES[index];
    if (!ex) return;

    var nameEl = document.getElementById('test-ex-name');
    var infoEl = document.getElementById('test-ex-info');
    var scoreWrap = document.getElementById('score-input-wrap');
    var scoreInput = document.getElementById('score-input');
    var timerText = document.getElementById('timer-text');
    var timerCircle = document.getElementById('timer-circle');

    if (nameEl) nameEl.textContent = ex.nom;
    if (infoEl) infoEl.textContent = 'Max en ' + ex.duree + ' secondes (' + ex.unite + ')';
    if (scoreWrap) scoreWrap.style.display = 'none';
    if (scoreInput) scoreInput.value = '';
    if (timerText) timerText.textContent = ex.duree;

    var circumference = 2 * Math.PI * 90; // ~565.49
    if (timerCircle) {
      timerCircle.style.strokeDasharray = circumference;
      timerCircle.style.strokeDashoffset = '0';
    }

    showTestScreen('exercise');

    /* Start countdown */
    var remaining = ex.duree;
    var total = ex.duree;

    testState.timerId = setInterval(function() {
      remaining--;
      if (timerText) timerText.textContent = remaining;
      var offset = ((total - remaining) / total) * circumference;
      if (timerCircle) timerCircle.style.strokeDashoffset = offset;

      if (remaining <= 0) {
        clearInterval(testState.timerId);
        testState.timerId = null;
        /* Play beep */
        playBeep();
        /* Show score input */
        var label = document.getElementById('score-label');
        if (label) label.textContent = ex.unite === 'secondes' ? 'Secondes tenues :' : 'Répétitions :';
        if (scoreWrap) scoreWrap.style.display = 'flex';
        if (scoreInput) scoreInput.focus();
      }
    }, 1000);
  }

  function validerScore() {
    var ex = TEST_EXERCISES[testState.exIndex];
    if (!ex) return;
    var scoreInput = document.getElementById('score-input');
    var val = parseInt(scoreInput ? scoreInput.value : 0) || 0;
    testState.scores[ex.id] = val;

    var nextIndex = testState.exIndex + 1;
    if (nextIndex < TEST_EXERCISES.length) {
      /* Show rest screen */
      lancerRepos(nextIndex);
    } else {
      /* Show results */
      afficherResultats();
    }
  }

  function lancerRepos(nextIndex) {
    testState.restSeconds = REST_DEFAULT;
    var nextEx = TEST_EXERCISES[nextIndex];

    var subEl = document.getElementById('rest-sub');
    if (subEl && nextEx) subEl.textContent = 'Prochain : ' + nextEx.nom;

    showTestScreen('rest');
    updateRestDisplay();

    testState.restTimerId = setInterval(function() {
      testState.restSeconds--;
      updateRestDisplay();
      if (testState.restSeconds <= 0) {
        clearInterval(testState.restTimerId);
        testState.restTimerId = null;
        playBeep();
        lancerExercice(nextIndex);
      }
    }, 1000);
  }

  function updateRestDisplay() {
    var el = document.getElementById('rest-time');
    if (!el) return;
    var m = Math.floor(testState.restSeconds / 60);
    var s = testState.restSeconds % 60;
    el.textContent = m + ':' + String(s).padStart(2, '0');
  }

  function ajusterRepos(delta) {
    testState.restSeconds = Math.max(0, testState.restSeconds + delta);
    updateRestDisplay();
  }

  function skipRepos() {
    if (testState.restTimerId) clearInterval(testState.restTimerId);
    testState.restTimerId = null;
    var nextIndex = testState.exIndex + 1;
    lancerExercice(nextIndex);
  }

  function afficherResultats() {
    var totalScore = 0;
    var detailHtml = '';

    TEST_EXERCISES.forEach(function(ex) {
      var val = testState.scores[ex.id] || 0;
      var partial = Math.min(val / ex.max, 1) * ex.poids * 100;
      totalScore += partial;
      detailHtml += '<div class="results-row"><span>' + esc(ex.nom) + '</span><span>' +
                    val + ' ' + ex.unite + '</span></div>';
    });

    var score = Math.round(totalScore);
    var niv;
    if      (score >= 90) niv = 'Expert';
    else if (score >= 65) niv = 'Avancé';
    else if (score >= 35) niv = 'Intermédiaire';
    else                  niv = 'Débutant';

    /* Save test results */
    SW_STORAGE.save('sw_test', {
      score: score,
      niveau: niv,
      details: testState.scores,
      date: new Date().toISOString().slice(0, 10)
    });

    /* Display */
    var scoreEl = document.getElementById('results-score');
    var levelEl = document.getElementById('results-level');
    var detailEl = document.getElementById('results-detail');

    if (scoreEl) scoreEl.textContent = score;
    if (levelEl) levelEl.textContent = 'Niveau : ' + niv;
    if (detailEl) detailEl.innerHTML = detailHtml;

    showTestScreen('results');

    /* Recalculate global level */
    recalculerNiveau();
    SW_PROFIL.showToast('Niveau : ' + niv + ' (' + score + '/100)');
  }

  function playBeep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) { /* silent fallback */ }
  }

  /* ═══════ D. GENERATE ═══════ */
  function bindGenerate() {
    var btn = document.getElementById('btn-generate');
    if (btn) btn.addEventListener('click', doGenerate);
    refreshGenerateBtn();

    /* Show saved programme if exists */
    var saved = SW_STORAGE.load('sw_programme');
    if (saved && saved.programme) {
      renderProgramme(saved, false);
    }
  }

  async function doGenerate() {
    var profil = SW_STORAGE.load('sw_profil') || {};
    var section = document.getElementById('programme-section');
    var loader = document.getElementById('programme-loader');
    var result = document.getElementById('programme-result');

    if (section) section.style.display = 'block';
    if (loader) loader.style.display = 'block';
    if (result) result.innerHTML = '';

    var exercices = await SW_API.fetchExercises(profil.objectif || 'MAINTIEN');

    var programme = null;
    var isAI = true;
    if (exercices.length > 0) {
      programme = await SW_API.generateProgramme(profil, exercices);
    }

    if (!programme || !programme.programme) {
      isAI = false;
      if (exercices.length === 0) {
        exercices = buildHardFallback();
      }
      programme = SW_API.generateFallback(profil, exercices);
    }

    if (loader) loader.style.display = 'none';
    renderProgramme(programme, !isAI);
  }

  function buildHardFallback() {
    var names = [
      'Pull-ups', 'Push-ups', 'Dips', 'Squats', 'Lunges',
      'Pike Push-ups', 'Inverted Rows', 'Burpees', 'Mountain Climbers',
      'Plank', 'Leg Raises', 'Diamond Push-ups', 'Jump Squats',
      'Chin-ups', 'Tricep Dips', 'Calf Raises', 'Russian Twist',
      'Hollow Body Hold', 'Superman Hold', 'Box Jumps'
    ];
    return names.map(function(n, i) {
      return { id: i, name: n, bodyPart: 'full', target: 'full', equipment: 'body weight' };
    });
  }

  function renderProgramme(data, isFallback) {
    var result = document.getElementById('programme-result');
    var section = document.getElementById('programme-section');
    if (!result) return;
    if (section) section.style.display = 'block';

    /* Load existing séances to show validate state */
    var seances = SW_STORAGE.load('sw_seances') || [];
    var doneMap = {};
    seances.forEach(function(s) {
      if (s.statut === 'effectuee') doneMap[s.jour] = true;
    });

    /* Progression */
    var doneCount = seances.filter(function(s) { return s.statut === 'effectuee'; }).length;
    var totalCount = data.programme ? data.programme.length : 0;

    var html = '';

    /* Progression bar */
    if (totalCount > 0) {
      var pct = Math.min((doneCount / totalCount) * 100, 100);
      html += '<div class="progression-wrap">';
      html += '<div class="progression-header">';
      html += '<span class="progression-label">Progression</span>';
      html += '<span class="progression-count">' + doneCount + ' / ' + totalCount + ' séances</span>';
      html += '</div>';
      html += '<div class="progression-track"><div class="progression-fill" style="width:' + pct + '%"></div></div>';
      html += '</div>';
    }

    if (isFallback) {
      html += '<div class="banner-info">Programme généré sans IA</div>';
    }

    if (data.programme) {
      data.programme.forEach(function(day, idx) {
        var isDone = doneMap[day.jour];
        html += '<div class="prog-card">';
        html += '<div class="prog-card-header">';
        html += '<span class="prog-day">' + esc(day.jour) + '</span>';
        html += '<span class="prog-meta">' + esc(day.type || '') + ' — ' + esc(day.duree || '') + '</span>';
        html += '</div>';

        if (day.exercices) {
          day.exercices.forEach(function(ex) {
            html += '<div class="prog-exercise">';
            html += '<div class="prog-ex-name">' + esc(ex.nom) + '</div>';
            html += '<div class="prog-ex-sets">' + (ex.series || 3) + ' x ' + esc(String(ex.reps || '10')) + '</div>';
            if (ex.repos) html += '<div class="prog-ex-rest">Repos : ' + esc(ex.repos) + '</div>';
            if (ex.conseil) html += '<div class="prog-ex-tip">' + esc(ex.conseil) + '</div>';
            html += '</div>';
          });
        }

        /* Validate button */
        if (isDone) {
          html += '<button class="btn-valider done" disabled>SÉANCE VALIDÉE</button>';
        } else {
          html += '<button class="btn-valider" data-seance-idx="' + idx + '">VALIDER LA SÉANCE</button>';
        }

        html += '</div>';
      });
    }

    if (data.conseil_global) {
      html += '<div class="conseil-global">' + esc(data.conseil_global) + '</div>';
    }

    html += '<div style="display:flex;gap:12px;margin-top:20px;">';
    html += '<button class="btn-primary" id="btn-save-prog" style="flex:1">ENREGISTRER</button>';
    html += '<button class="btn-secondary" id="btn-regen" style="flex:1">RÉGÉNÉRER</button>';
    html += '</div>';
    html += '<div id="prog-save-msg" class="success-msg" style="text-align:center;margin-top:8px;"></div>';

    result.innerHTML = html;

    /* Bind save */
    var saveBtn = document.getElementById('btn-save-prog');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        SW_STORAGE.save('sw_programme', data);

        /* Auto-generate séances from programme + jours */
        genererSeances(data);

        var msg = document.getElementById('prog-save-msg');
        var profil = SW_STORAGE.load('sw_profil') || {};
        var nextDay = profil.jours && profil.jours.length > 0 ? profil.jours[0] : '';
        if (msg) msg.textContent = 'Programme enregistré ! Prochaine séance : ' + nextDay;
        SW_PROFIL.showToast('Programme enregistré');
      });
    }

    /* Bind regen */
    var regenBtn = document.getElementById('btn-regen');
    if (regenBtn) {
      regenBtn.addEventListener('click', doGenerate);
    }

    /* Bind validate buttons */
    result.querySelectorAll('.btn-valider:not(.done)').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.dataset.seanceIdx);
        validerSeance(idx, data, btn);
      });
    });
  }

  /* ═══════ E. SÉANCES ═══════ */
  function genererSeances(data) {
    if (!data || !data.programme) return;

    var profil = SW_STORAGE.load('sw_profil') || {};
    var jours = profil.jours || [];
    var jourMap = { 'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4,
                    'Vendredi': 5, 'Samedi': 6, 'Dimanche': 0 };

    var today = new Date();
    var seances = [];

    data.programme.forEach(function(day, i) {
      /* Find the next date matching the day's jour in profil.jours */
      var targetDow = jourMap[day.jour];
      var date = new Date(today);

      if (typeof targetDow === 'number') {
        /* Find next occurrence of this weekday */
        var currentDow = date.getDay();
        var diff = targetDow - currentDow;
        if (diff <= 0) diff += 7;
        date.setDate(date.getDate() + diff);
      } else {
        /* Fallback: space out by i days */
        date.setDate(date.getDate() + i + 1);
      }

      var dateStr = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');

      seances.push({
        id: i,
        jour: day.jour,
        type: day.type || '',
        date: dateStr,
        statut: 'planifiee',
        exercices: day.exercices || []
      });
    });

    SW_STORAGE.save('sw_seances', seances);
    renderCalendar();
    recalculerNiveau();
  }

  function validerSeance(idx, data, btnEl) {
    var seances = SW_STORAGE.load('sw_seances') || [];
    var todayStr = new Date().toISOString().slice(0, 10);

    if (seances[idx]) {
      seances[idx].statut = 'effectuee';
      seances[idx].date = todayStr;
      seances[idx].date_effectuee = todayStr;
    } else {
      /* Create entry if missing */
      var day = data.programme && data.programme[idx] ? data.programme[idx] : {};
      seances.push({
        id: idx,
        jour: day.jour || '',
        type: day.type || '',
        date: todayStr,
        statut: 'effectuee',
        date_effectuee: todayStr,
        exercices: day.exercices || []
      });
    }

    SW_STORAGE.save('sw_seances', seances);

    /* Update button */
    if (btnEl) {
      btnEl.classList.add('done');
      btnEl.disabled = true;
      btnEl.textContent = 'SÉANCE VALIDÉE';
    }

    /* Refresh everything */
    renderCalendar();
    recalculerNiveau();
    updateProgression(data);
    SW_PROFIL.showToast('Séance validée !');
  }

  function updateProgression(data) {
    var seances = SW_STORAGE.load('sw_seances') || [];
    var doneCount = seances.filter(function(s) { return s.statut === 'effectuee'; }).length;
    var totalCount = data.programme ? data.programme.length : 1;
    var pct = Math.min((doneCount / totalCount) * 100, 100);

    var countEl = document.querySelector('.progression-count');
    var fillEl = document.querySelector('.progression-fill');
    if (countEl) countEl.textContent = doneCount + ' / ' + totalCount + ' séances';
    if (fillEl) fillEl.style.width = pct + '%';
  }

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  return { init: init, recalculerNiveau: recalculerNiveau };

})();

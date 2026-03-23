/* ═══════════════════════════════════════════════════════
   ENTRAÎNEMENT — js/entrainement.js
   Objectif, Planning, Calendrier, Programme
   ═══════════════════════════════════════════════════════ */

var SW_ENTRAINEMENT = (function() {

  var calYear, calMonth;

  function init() {
    initObjectif();
    initPlanning();
    initCalendar();
    initLevel();
    initTestModal();
    bindGenerate();
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

    /* Restore saved frequency */
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

    /* Restore saved days */
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
      if (s.date) seanceDates[s.date] = true;
    });

    var first = new Date(calYear, calMonth, 1);
    var startDay = (first.getDay() + 6) % 7; // Monday = 0
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
      else if (seanceDates[dateStr]) cls += ' done';
      html += '<div class="' + cls + '">' + d + '</div>';
    }
    grid.innerHTML = html;
  }

  /* ═══════ C2. LEVEL ═══════ */
  function initLevel() {
    renderLevel();
  }

  function renderLevel() {
    var seances = SW_STORAGE.load('sw_seances') || [];
    var count = seances.length;
    var niv, next, need;
    if      (count >= 31) { niv = 'Expert';        next = null;            need = 0; }
    else if (count >= 16) { niv = 'Avancé';        next = 'Expert';        need = 31 - count; }
    else if (count >= 6)  { niv = 'Intermédiaire'; next = 'Avancé';        need = 16 - count; }
    else                  { niv = 'Débutant';       next = 'Intermédiaire'; need = 6 - count; }

    var thresholds = [0, 6, 16, 31];
    var curThresh = count >= 31 ? 31 : count >= 16 ? 16 : count >= 6 ? 6 : 0;
    var nextThresh = count >= 31 ? 31 : count >= 16 ? 31 : count >= 6 ? 16 : 6;
    var pct = nextThresh > curThresh ? ((count - curThresh) / (nextThresh - curThresh)) * 100 : 100;

    var badge = document.getElementById('level-badge');
    var bar = document.getElementById('level-bar');
    var info = document.getElementById('level-info');

    if (badge) badge.textContent = niv;
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
    if (info) info.textContent = next
      ? need + ' séance' + (need > 1 ? 's' : '') + ' pour atteindre ' + next
      : 'Niveau maximum atteint';
  }

  /* ═══════ C3. TEST DE NIVEAU ═══════ */
  function initTestModal() {
    var openBtn = document.getElementById('btn-open-test');
    var overlay = document.getElementById('modal-test');
    var closeBtn = document.getElementById('modal-test-close');
    var submitBtn = document.getElementById('btn-submit-test');

    if (openBtn && overlay) {
      openBtn.addEventListener('click', function() { overlay.classList.add('open'); });
    }
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', function() { overlay.classList.remove('open'); });
    }
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        var tractions = parseInt(document.getElementById('test-tractions').value) || 0;
        var dips      = parseInt(document.getElementById('test-dips').value) || 0;
        var pompes    = parseInt(document.getElementById('test-pompes').value) || 0;
        var gainage   = parseInt(document.getElementById('test-gainage').value) || 0;

        /* Score pondéré (sur 100) */
        var maxT = 50, maxD = 40, maxP = 80, maxG = 300;
        var score = (
          Math.min(tractions / maxT, 1) * 0.40 +
          Math.min(dips / maxD, 1) * 0.25 +
          Math.min(pompes / maxP, 1) * 0.20 +
          Math.min(gainage / maxG, 1) * 0.15
        ) * 100;

        var niv;
        if      (score >= 90) niv = 'Expert';
        else if (score >= 65) niv = 'Avancé';
        else if (score >= 35) niv = 'Intermédiaire';
        else                  niv = 'Débutant';

        SW_STORAGE.update('sw_profil', { niveau: niv, score_test: Math.round(score) });

        if (overlay) overlay.classList.remove('open');
        renderLevel();
        SW_PROFIL.renderStats();
        SW_PROFIL.showToast('Niveau : ' + niv + ' (' + Math.round(score) + '/100)');
      });
    }
  }

  /* ═══════ D. GENERATE ═══════ */
  function bindGenerate() {
    var btn = document.getElementById('btn-generate');
    var regenBtn = document.getElementById('btn-regen');
    if (btn) btn.addEventListener('click', doGenerate);
    if (regenBtn) regenBtn.addEventListener('click', doGenerate);
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

    /* 1. Fetch exercises */
    var exercices = await SW_API.fetchExercises(profil.objectif || 'MAINTIEN');

    /* 2. Try OpenAI */
    var programme = null;
    var isAI = true;
    if (exercices.length > 0) {
      programme = await SW_API.generateProgramme(profil, exercices);
    }

    /* 3. Fallback if needed */
    if (!programme || !programme.programme) {
      isAI = false;
      if (exercices.length === 0) {
        /* Hard fallback with generic exercises */
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

    var html = '';
    if (isFallback) {
      html += '<div class="banner-info">Programme généré sans IA</div>';
    }

    if (data.programme) {
      data.programme.forEach(function(day) {
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
  }

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  return { init: init };

})();

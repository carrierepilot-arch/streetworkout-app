/* ========================================
   PROGRESSION.JS — Exercise Progression System
   ======================================== */

/* Exercise data */
var EXERCISES = [
  {
    id: 'pullups',
    name: 'Tractions',
    icon: '💪',
    color: '#00FF87',
    steps: [
      { id: 'pullups-1', name: 'Suspension active', desc: 'Maintien bras tendus à la barre, 20s+' },
      { id: 'pullups-2', name: 'Rangée australienne', desc: 'Inverted row sous une barre basse' },
      { id: 'pullups-3', name: 'Traction assistée élastique', desc: 'Bande de résistance pour alléger le poids' },
      { id: 'pullups-4', name: 'Traction stricte', desc: 'Chin-up puis pull-up menton au-dessus de la barre' },
      { id: 'pullups-5', name: 'Traction lestée', desc: 'Gilet ou ceinture lestée avec charge additionnelle' },
      { id: 'pullups-6', name: 'Traction à une main', desc: 'Objectif ultime — contrôle total unilatéral' }
    ]
  },
  {
    id: 'dips',
    name: 'Dips',
    icon: '🔥',
    color: '#00B4FF',
    steps: [
      { id: 'dips-1', name: 'Dips sur chaise', desc: 'Position assise, mains sur le rebord, descente contrôlée' },
      { id: 'dips-2', name: 'Dips barres parallèles', desc: 'Poids de corps uniquement, amplitude complète' },
      { id: 'dips-3', name: 'Dips lestés gilet', desc: 'Ajout progressif de charge avec un gilet' },
      { id: 'dips-4', name: 'Dips ceinture + disques', desc: 'Charges lourdes suspendues à la ceinture' },
      { id: 'dips-5', name: 'Dips explosifs', desc: 'Poussée dynamique avec temps de vol' }
    ]
  },
  {
    id: 'pushups',
    name: 'Pompes',
    icon: '⚡',
    color: '#FF6B35',
    steps: [
      { id: 'pushups-1', name: 'Pompes sur genoux', desc: 'Version allégée pour construire la base' },
      { id: 'pushups-2', name: 'Pompes normales', desc: 'Position planche, amplitude complète' },
      { id: 'pushups-3', name: 'Pompes diamant', desc: 'Mains rapprochées pour cibler les triceps' },
      { id: 'pushups-4', name: 'Pompes déclinées', desc: 'Pieds surélevés pour augmenter la difficulté' },
      { id: 'pushups-5', name: 'Pompes claquées', desc: 'Poussée explosive avec claquement des mains' },
      { id: 'pushups-6', name: 'Pompes en appui renversé', desc: 'Objectif — handstand push-up contre le mur' }
    ]
  },
  {
    id: 'squats',
    name: 'Squats',
    icon: '🦵',
    color: '#00FF87',
    steps: [
      { id: 'squats-1', name: 'Squat assisté', desc: 'Avec TRX ou appui sur une chaise pour l\'équilibre' },
      { id: 'squats-2', name: 'Goblet squat', desc: 'Sans charge, focus sur la mobilité articulaire' },
      { id: 'squats-3', name: 'Squat air', desc: 'Parfaite exécution pieds parallèles, profondeur maximale' },
      { id: 'squats-4', name: 'Squat lesté', desc: 'Gilet ou sac lesté pour ajouter de la résistance' },
      { id: 'squats-5', name: 'Pistol squat progressions', desc: 'Travail unilatéral progressif avec support' },
      { id: 'squats-6', name: 'Pistol squat complet', desc: 'Objectif — squat une jambe complet et contrôlé' }
    ]
  },
  {
    id: 'muscleup',
    name: 'Muscle-up',
    icon: '🚀',
    color: '#FF3D5A',
    steps: [
      { id: 'muscleup-1', name: 'Tractions explosives', desc: 'Tête au-dessus de la barre à chaque rep' },
      { id: 'muscleup-2', name: 'Sortie de buste', desc: 'Partial muscle-up — monter le torse au-dessus' },
      { id: 'muscleup-3', name: 'Muscle-up avec élastique', desc: 'Bande d\'assistance pour la transition' },
      { id: 'muscleup-4', name: 'Muscle-up kipping', desc: 'Utilisation de l\'élan contrôlé pour passer' },
      { id: 'muscleup-5', name: 'Muscle-up strict', desc: 'Objectif — transition fluide sans élan' }
    ]
  },
  {
    id: 'frontlever',
    name: 'Front Lever',
    icon: '🏋️',
    color: '#00B4FF',
    steps: [
      { id: 'frontlever-1', name: 'Compression abdominale', desc: 'Hollow body hold — dos plaqué au sol' },
      { id: 'frontlever-2', name: 'Front lever groupé', desc: 'Genoux ramenés vers la poitrine suspendu' },
      { id: 'frontlever-3', name: 'Front lever une jambe', desc: 'Une jambe tendue, une repliée pour l\'équilibre' },
      { id: 'frontlever-4', name: 'Front lever straddle', desc: 'Deux jambes tendues écartées horizontalement' },
      { id: 'frontlever-5', name: 'Front lever planche complète', desc: 'Objectif — position horizontale parfaite' }
    ]
  },
  {
    id: 'handstand',
    name: 'Handstand / HSPU',
    icon: '🤸',
    color: '#7C3AED',
    steps: [
      { id: 'handstand-1', name: 'Planche inclinée sur mur', desc: 'Pieds sur le mur, corps incliné à 45°' },
      { id: 'handstand-2', name: 'Kick-up contre le mur', desc: 'Monter en équilibre contre le mur 20-30s' },
      { id: 'handstand-3', name: 'Handstand contre mur (tendu)', desc: 'Corps parfaitement aligné, maintien 30s+' },
      { id: 'handstand-4', name: 'HSPU partiel contre mur', desc: 'Descente partielle du crâne vers le sol' },
      { id: 'handstand-5', name: 'HSPU complet contre mur', desc: 'Amplitude totale crâne-sol-bras tendus' },
      { id: 'handstand-6', name: 'Handstand libre 5s+', desc: 'Équilibre libre sans support' },
      { id: 'handstand-7', name: 'Handstand libre 30s+', desc: 'Objectif — équilibre libre maîtrisé' }
    ]
  },
  {
    id: 'backlever',
    name: 'Back Lever',
    icon: '🏊',
    color: '#EA580C',
    steps: [
      { id: 'backlever-1', name: 'German hang passif', desc: 'Suspension épaules en arrière, corps tombant' },
      { id: 'backlever-2', name: 'Back lever groupé', desc: 'Genoux ramenés, dos horizontal' },
      { id: 'backlever-3', name: 'Back lever une jambe', desc: 'Une jambe tendue, une repliée' },
      { id: 'backlever-4', name: 'Back lever straddle', desc: 'Deux jambes tendues écartées horizontalement' },
      { id: 'backlever-5', name: 'Back lever planche', desc: 'Objectif — position horizontale dos au sol' }
    ]
  },
  {
    id: 'humanflag',
    name: 'Human Flag',
    icon: '🚩',
    color: '#0284C7',
    steps: [
      { id: 'humanflag-1', name: 'Side plank vertical', desc: 'Gainage latéral sur poteau / mur' },
      { id: 'humanflag-2', name: 'Flag groupé', desc: 'Corps en boule, position latérale sur poteau' },
      { id: 'humanflag-3', name: 'Flag avec assistance', desc: 'Un élastique ou un appui pour maintenir l\'horizontale' },
      { id: 'humanflag-4', name: 'Flag straddle', desc: 'Jambes écartées pour réduire le bras de levier' },
      { id: 'humanflag-5', name: 'Human flag complet', desc: 'Objectif — corps horizontal parfait 3s+' }
    ]
  }
];

/* Status options */
var STATUS_OPTIONS = [
  { value: 'not-acquired', label: '⬜ Non acquis' },
  { value: 'in-progress', label: '🔄 En cours' },
  { value: 'mastered', label: '✅ Maîtrisé' }
];

function initProgression() {
  if (!requireAuth()) return;

  renderOverview();
  renderAccordions();
  updateGlobalScore();

  /* Logout handled globally by nav.js */
}

/* Render overview circles at top */
function renderOverview() {
  var container = document.getElementById('overview-circles');
  if (!container) return;

  var html = '';
  EXERCISES.forEach(function(ex) {
    var stats = getExerciseStats(ex);
    var pct = ex.steps.length > 0 ? Math.round((stats.mastered / ex.steps.length) * 100) : 0;
    var circumference = 2 * Math.PI * 34;
    var offset = circumference - (pct / 100) * circumference;

    html += '<div class="overview-circle">' +
      '<div class="progress-circle">' +
      '<svg width="80" height="80" viewBox="0 0 80 80">' +
      '<circle class="progress-circle-bg" cx="40" cy="40" r="34"/>' +
      '<circle class="progress-circle-fill" cx="40" cy="40" r="34" ' +
      'stroke="' + ex.color + '" ' +
      'stroke-dasharray="' + circumference + '" ' +
      'stroke-dashoffset="' + offset + '"/>' +
      '</svg>' +
      '<span class="progress-circle-text" style="font-size:0.75rem;">' + pct + '%</span>' +
      '</div>' +
      '<span class="overview-label">' + ex.icon + ' ' + ex.name + '</span>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* Get stats for an exercise */
function getExerciseStats(exercise) {
  var data = SW.load('progression') || {};
  var mastered = 0;
  var inProgress = 0;
  var total = exercise.steps.length;

  exercise.steps.forEach(function(step) {
    var status = data[step.id] || 'not-acquired';
    if (status === 'mastered') mastered++;
    if (status === 'in-progress') inProgress++;
  });

  return { mastered: mastered, inProgress: inProgress, total: total };
}

/* Render accordion sections */
function renderAccordions() {
  var container = document.getElementById('progression-list');
  if (!container) return;

  var data = SW.load('progression') || {};
  var html = '';

  EXERCISES.forEach(function(ex, idx) {
    var stats = getExerciseStats(ex);
    var barPct = ex.steps.length > 0 ? Math.round((stats.mastered / ex.steps.length) * 100) : 0;

    html += '<div class="accordion-item card" id="accordion-' + ex.id + '">' +
      '<div class="accordion-header" onclick="toggleAccordion(\'' + ex.id + '\')">' +
      '<div class="accordion-header-left">' +
      '<span class="accordion-icon">' + ex.icon + '</span>' +
      '<div>' +
      '<div class="accordion-title">' + ex.name + '</div>' +
      '<div class="accordion-meta">' + stats.mastered + '/' + stats.total + ' étapes maîtrisées</div>' +
      '</div>' +
      '</div>' +
      '<div class="accordion-header-right">' +
      '<div class="mini-progress" style="width:60px;">' +
      '<div class="progress-bar" style="height:6px;">' +
      '<div class="progress-bar-fill" style="width:' + barPct + '%; background:' + ex.color + ';"></div>' +
      '</div>' +
      '</div>' +
      '<span class="accordion-arrow">▼</span>' +
      '</div>' +
      '</div>' +
      '<div class="accordion-content">' +
      '<div class="steps-list">';

    ex.steps.forEach(function(step, stepIdx) {
      var currentStatus = data[step.id] || 'not-acquired';

      html += '<div class="step-row" id="step-row-' + step.id + '">' +
        '<div class="step-info">' +
        '<div class="step-counter">' + (stepIdx + 1) + '</div>' +
        '<div>' +
        '<div class="step-name">' + step.name + '</div>' +
        '<div class="step-desc">' + step.desc + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="status-radio-group">';

      STATUS_OPTIONS.forEach(function(opt) {
        var checked = currentStatus === opt.value ? ' checked' : '';
        var inputId = step.id + '-' + opt.value;
        html += '<input type="radio" class="status-radio" name="status-' + step.id + '" ' +
          'id="' + inputId + '" value="' + opt.value + '"' + checked +
          ' onchange="updateStepStatus(\'' + step.id + '\', \'' + opt.value + '\', this)">' +
          '<label class="status-label" for="' + inputId + '">' + opt.label + '</label>';
      });

      html += '</div></div>';
    });

    html += '</div></div></div>';
  });

  container.innerHTML = html;
}

/* Toggle accordion */
function toggleAccordion(exerciseId) {
  var el = document.getElementById('accordion-' + exerciseId);
  if (el) {
    el.classList.toggle('open');
  }
}

/* Update step status */
function updateStepStatus(stepId, newValue, inputEl) {
  var data = SW.load('progression') || {};
  var oldValue = data[stepId] || 'not-acquired';
  data[stepId] = newValue;
  SW.save('progression', data);

  /* Confetti if mastered */
  if (newValue === 'mastered' && oldValue !== 'mastered') {
    var rect = inputEl.parentElement.getBoundingClientRect();
    launchConfetti(rect.left + rect.width / 2, rect.top);
    showToast('Étape maîtrisée ! 🎉');
  }

  renderOverview();
  updateGlobalScore();
  updateAccordionMeta();
}

/* Update accordion meta (step counts) without full re-render */
function updateAccordionMeta() {
  EXERCISES.forEach(function(ex) {
    var stats = getExerciseStats(ex);
    var barPct = ex.steps.length > 0 ? Math.round((stats.mastered / ex.steps.length) * 100) : 0;
    var accordion = document.getElementById('accordion-' + ex.id);
    if (accordion) {
      var meta = accordion.querySelector('.accordion-meta');
      if (meta) meta.textContent = stats.mastered + '/' + stats.total + ' étapes maîtrisées';
      var barFill = accordion.querySelector('.accordion-header .progress-bar-fill');
      if (barFill) barFill.style.width = barPct + '%';
    }
  });
}

/* Update global score */
function updateGlobalScore() {
  var totalSteps = 0;
  var totalMastered = 0;

  EXERCISES.forEach(function(ex) {
    var stats = getExerciseStats(ex);
    totalSteps += stats.total;
    totalMastered += stats.mastered;
  });

  var pct = totalSteps > 0 ? Math.round((totalMastered / totalSteps) * 100) : 0;
  var globalEl = document.getElementById('global-score');
  if (globalEl) globalEl.textContent = pct + '% du parcours complet';

  var globalCount = document.getElementById('global-count');
  if (globalCount) globalCount.textContent = totalMastered + '/' + totalSteps + ' étapes';
}

/* Initialize on load */
document.addEventListener('DOMContentLoaded', initProgression);

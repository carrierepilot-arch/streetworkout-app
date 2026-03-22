// js/onboarding.js — Flux onboarding complet

var OB = {
  step: 0,
  sub: 0,
  data: {},

  // Definition des sous-questions par etape
  questions: [
    // ETAPE 0 — Profil
    {
      step: '01', label: 'TON PROFIL',
      type: 'text', key: 'prenom',
      title: 'Comment tu t\'appelles ?',
      placeholder: 'Ton pr\u00e9nom'
    },
    {
      step: '01', label: 'TON PROFIL',
      type: 'choice-single', key: 'genre',
      title: 'Quel est ton genre ?',
      choices: [
        { value: 'homme', label: 'Homme', icon: '\u2642' },
        { value: 'femme', label: 'Femme', icon: '\u2640' },
        { value: 'autre', label: 'Autre', icon: '\u25C7' }
      ]
    },

    // ETAPE 1 — Corps
    {
      step: '02', label: 'TON CORPS',
      type: 'ruler', key: 'taille',
      title: 'Quelle est ta <span>taille</span> actuelle ?',
      unit: 'cm', min: 140, max: 220, default: 175
    },
    {
      step: '02', label: 'TON CORPS',
      type: 'ruler', key: 'poids',
      title: 'Quel est ton <span>poids</span> actuel ?',
      unit: 'kg', min: 40, max: 150, default: 75
    },
    {
      step: '02', label: 'TON CORPS',
      type: 'morpho', key: 'morpho_actuelle',
      title: 'Quelle est ta <span>morphologie</span> actuelle ?',
      feedback: [
        { range: [0,0.15], label: 'Masse grasse (Id\u00e9al)', value: '7\u201310%', desc: 'Votre silhouette est presque parfaite ! Continuez comme \u00e7a !', color: 'var(--success)' },
        { range: [0.15,0.35], label: 'Masse grasse', value: '11\u201315%', desc: 'Bonne condition physique g\u00e9n\u00e9rale.', color: 'var(--blue)' },
        { range: [0.35,0.55], label: 'Masse grasse', value: '16\u201320%', desc: 'Avec un programme adapt\u00e9, tu peux facilement progresser.', color: 'var(--blue)' },
        { range: [0.55,0.75], label: 'Masse grasse', value: '21\u201325%', desc: 'Un bon programme de street workout va tout changer.', color: 'var(--warning)' },
        { range: [0.75,0.9], label: 'Masse grasse', value: '26\u201330%', desc: 'Bonne nouvelle : les d\u00e9butants progressent tr\u00e8s vite !', color: 'var(--warning)' },
        { range: [0.9,1], label: 'Masse grasse', value: '30%+', desc: 'Petit \u00e0 petit ! Cet objectif est pratique et adapt\u00e9.', color: 'var(--danger)' }
      ]
    },
    {
      step: '02', label: 'TON CORPS',
      type: 'ruler', key: 'poids_cible',
      title: 'Quel est ton <span>poids cible</span> ?',
      unit: 'kg', min: 40, max: 150, default: 70
    },
    {
      step: '02', label: 'TON CORPS',
      type: 'morpho', key: 'morpho_cible',
      title: 'Quelle est ta forme corporelle <span>cible</span> ?',
      feedback: [
        { range: [0,0.2], label: 'Pourcentage de graisse cible', value: '4\u20136%', desc: 'Petit \u00e0 petit ! Cet objectif est pratique et adapt\u00e9 aux d\u00e9butants.', color: 'var(--success)' },
        { range: [0.2,0.4], label: 'Pourcentage de graisse cible', value: '7\u201310%', desc: 'Corps cisel\u00e9 \u2014 objectif atteignable avec de la r\u00e9gularit\u00e9.', color: 'var(--success)' },
        { range: [0.4,0.6], label: 'Pourcentage de graisse cible', value: '11\u201315%', desc: 'Forme athl\u00e9tique \u2014 tr\u00e8s r\u00e9aliste en 3 \u00e0 6 mois.', color: 'var(--blue)' },
        { range: [0.6,0.8], label: 'Pourcentage de graisse cible', value: '16\u201320%', desc: 'Objectif raisonnable et motivant.', color: 'var(--blue)' },
        { range: [0.8,1], label: 'Pourcentage de graisse cible', value: '20%+', desc: 'Chaque petit pas compte. Tu peux y arriver !', color: 'var(--warning)' }
      ]
    },

    // ETAPE 2 — Fitness
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'choice-single', key: 'niveau_pompes',
      title: 'Combien de pompes peux-tu faire en une s\u00e9rie ?',
      choices: [
        { value: 'debutant', label: 'D\u00e9butant', sublabel: '0\u20135 pompes', icon: '\u25C7' },
        { value: 'intermediaire', label: 'Interm\u00e9diaire', sublabel: '5\u201315 pompes', icon: '\u25C8' },
        { value: 'avance', label: 'Avanc\u00e9', sublabel: 'Au moins 15 pompes', icon: '\u25C6',
          feedback: 'Tu es clairement dans le top niveau ! On va vraiment te challenger.' }
      ]
    },
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'choice-single', key: 'niveau_tractions',
      title: 'Combien de tractions peux-tu faire ?',
      choices: [
        { value: 'zero', label: 'Aucune pour l\'instant', sublabel: 'Pas de barre ou pas encore', icon: '\u25C7' },
        { value: 'debutant', label: 'Quelques-unes', sublabel: '1 \u00e0 5 tractions', icon: '\u25C8' },
        { value: 'avance', label: 'Bien entra\u00een\u00e9', sublabel: '5 tractions ou plus', icon: '\u25C6',
          feedback: 'Excellent niveau ! Les tractions sont la cl\u00e9 de la calisth\u00e9nie.' }
      ]
    },
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'choice-single', key: 'type_exercice',
      title: 'Quel type d\'exercice pr\u00e9f\u00e8res-tu ?',
      choices: [
        { value: 'poids_corps', label: 'Sans \u00e9quipement', sublabel: 'Pompes, squats, gainage', icon: '\u2298' },
        { value: 'barre', label: 'Avec barre de traction', sublabel: 'Pull-ups, dips, skills', icon: '\u229F',
          feedback: 'La barre de traction = l\'outil n\u00b01 du street workout. Excellent choix !' },
        { value: 'leste', label: 'Avec lest', sublabel: 'Gilet lest\u00e9, ceinture', icon: '\u229E' },
        { value: 'mixte', label: 'Peu importe', sublabel: 'Tout ce qui est efficace', icon: '\u2295' }
      ]
    },
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'choice-single', key: 'lieu',
      title: 'O\u00f9 t\'entra\u00eenes-tu habituellement ?',
      choices: [
        { value: 'exterieur', label: 'En ext\u00e9rieur', sublabel: 'Parc, barre de rue, terrain', icon: '\u2299' },
        { value: 'maison', label: '\u00c0 la maison', sublabel: 'Barre de porte, sol', icon: '\u229F' },
        { value: 'salle', label: 'En salle', sublabel: 'Gym ou salle de sport', icon: '\u229E' },
        { value: 'partout', label: 'Peu importe', sublabel: 'Je m\'adapte', icon: '\u2295',
          feedback: 'Parfait ! Un vrai warrior du street workout s\'adapte \u00e0 tout !' }
      ]
    },
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'slider-steps', key: 'frequence',
      title: '\u00c0 quelle fr\u00e9quence veux-tu t\'entra\u00eener ?',
      steps: ['1\u00d7/sem', '2\u00d7/sem', '3\u00d7/sem', '4\u00d7/sem', '5\u00d7/sem', '6\u00d7/sem'],
      default: 2,
      feedbacks: [
        'Parfait pour commencer doucement.',
        'Un bon rythme pour progresser r\u00e9guli\u00e8rement.',
        'Tr\u00e8s bon rythme ! Tu vas progresser vite.',
        'Rythme avanc\u00e9 \u2014 assure-toi de bien r\u00e9cup\u00e9rer.',
        'Niveau athl\u00e8te \u2014 requiert une bonne condition physique.',
        'Entra\u00eenement quotidien \u2014 r\u00e9serv\u00e9 aux sportifs confirm\u00e9s.'
      ]
    },
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'choice-single', key: 'intensite',
      title: 'Quel niveau d\'intensit\u00e9 pr\u00e9f\u00e8res-tu ?',
      choices: [
        { value: 'facile', label: 'Facile \u00e0 commencer', sublabel: 'Je reviens doucement', icon: '\u270B' },
        { value: 'modere', label: 'Transpiration l\u00e9g\u00e8re', sublabel: 'Un effort confortable', icon: '\u25F7' },
        { value: 'exigeant', label: 'Un peu exigeant', sublabel: 'Je veux me d\u00e9passer', icon: '\u26A1',
          feedback: 'Repousse tes limites ! Sur le chemin pour te d\u00e9passer, on sera l\u00e0 pour te soutenir.' },
        { value: 'maximum', label: 'Maximum', sublabel: 'Je veux tout donner', icon: '\u25C6' }
      ]
    },
    {
      step: '03', label: '\u00c9VALUATION FITNESS',
      type: 'choice-multi', key: 'blessures',
      title: 'Des inconforts ou blessures \u00e0 prendre en compte ?',
      choices: [
        { value: 'aucun', label: 'Aucun', icon: '\u2298' },
        { value: 'genou', label: 'Genou', icon: '\u22D9' },
        { value: 'dos_bas', label: 'Bas du dos', icon: '\u2291' },
        { value: 'epaule', label: '\u00c9paule', icon: '\u22A2' },
        { value: 'poignet', label: 'Poignet', icon: '\u22A3' },
        { value: 'coude', label: 'Coude', icon: '\u22A4' }
      ]
    }
  ],

  // Rendu
  render: function() {
    var q = this.questions[this.sub];
    if (!q) { this.showLoading(); return; }

    var totalSubs = this.questions.length;
    var self = this;

    var progressHtml = '';
    for (var i = 0; i < totalSubs; i++) {
      var cls = i < this.sub ? 'progress-seg--done' : (i === this.sub ? 'progress-seg--active' : '');
      progressHtml += '<div class="progress-seg ' + cls + '"></div>';
    }

    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="ob-page">' +
        '<div class="ob-top">' +
          '<button class="back-btn" id="ob-back">&#8592;</button>' +
          '<div style="flex:1">' +
            '<div class="onboarding-header">' +
              '<span class="onboarding-step-label">' + q.step + ' &nbsp; ' + q.label + '</span>' +
            '</div>' +
            '<div class="onboarding-progress">' + progressHtml + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ob-content">' +
          '<h1 class="question-title">' + q.title + '</h1>' +
          '<div id="question-body">' + this.renderQuestion(q) + '</div>' +
        '</div>' +
        '<div class="ob-bottom">' +
          '<button class="btn btn-dark btn--full" id="btn-next">SUIVANT</button>' +
        '</div>' +
      '</div>';

    document.getElementById('ob-back').addEventListener('click', function() { self.back(); });
    document.getElementById('btn-next').addEventListener('click', function() { self.next(); });
    this.bindQuestion(q);
  },

  renderQuestion: function(q) {
    if (q.type === 'text') {
      return '<input type="text" class="input" id="q-input" placeholder="' + q.placeholder + '"' +
        ' value="' + (this.data[q.key] || '') + '" style="font-size:20px;text-align:center;padding:20px">';
    }
    if (q.type === 'ruler') {
      var val = this.data[q.key] || q.default;
      return '<div class="ruler-wrap">' +
          '<div class="ruler-value" id="ruler-val">' + val + '</div>' +
          '<span class="ruler-unit">' + q.unit + '</span>' +
        '</div>' +
        '<div class="ruler-track" id="ruler-track">' +
          '<div class="ruler-cursor"></div>' +
          '<div class="ruler-ticks" id="ruler-ticks"></div>' +
        '</div>';
    }
    if (q.type === 'morpho') {
      var val = this.data[q.key] !== undefined ? this.data[q.key] : 0.2;
      var fb = null;
      for (var i = 0; i < q.feedback.length; i++) {
        if (val >= q.feedback[i].range[0] && val <= q.feedback[i].range[1]) { fb = q.feedback[i]; break; }
      }
      if (!fb) fb = q.feedback[0];
      return '<div style="height:160px;background:#F0F4FF;border-radius:16px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:14px;">' +
          '[Illustration morphologie]' +
        '</div>' +
        '<input type="range" class="morpho-slider" id="morpho-slider"' +
          ' min="0" max="100" value="' + Math.round(val * 100) + '" style="--pct:' + Math.round(val * 100) + '%">' +
        '<div class="morpho-labels"><span>Cisel\u00e9e</span><span>Dodue</span></div>' +
        '<div class="feedback-box" id="morpho-fb">' +
          '<div class="feedback-box-title" style="color:' + fb.color + '">' + fb.label + ' \u2014 ' + fb.value + '</div>' +
          '<div class="feedback-box-text">' + fb.desc + '</div>' +
        '</div>';
    }
    if (q.type === 'choice-single' || q.type === 'choice-multi') {
      var selected = this.data[q.key];
      var html = '';
      for (var i = 0; i < q.choices.length; i++) {
        var c = q.choices[i];
        var isActive = selected === c.value || (Array.isArray(selected) && selected.indexOf(c.value) !== -1);
        html += '<div class="choice-item' + (isActive ? ' choice-item--active' : '') + '"' +
          ' data-value="' + c.value + '" data-key="' + q.key + '" data-multi="' + (q.type === 'choice-multi') + '">' +
          '<div class="choice-icon">' + (c.icon || '\u25C7') + '</div>' +
          '<div style="flex:1">' +
            '<div class="choice-label">' + c.label + '</div>' +
            (c.sublabel ? '<div class="choice-sublabel">' + c.sublabel + '</div>' : '') +
          '</div>' +
          '<div class="choice-check"></div>' +
        '</div>';
        if (c.feedback && isActive) {
          html += '<div class="feedback-box"><div class="feedback-box-text">' + c.feedback + '</div></div>';
        }
      }
      return html;
    }
    if (q.type === 'slider-steps') {
      var val = this.data[q.key] !== undefined ? this.data[q.key] : q.default;
      return '<div style="text-align:center;font-size:28px;font-weight:800;margin:16px 0" id="step-val">' + q.steps[val] + '</div>' +
        '<input type="range" class="morpho-slider" id="step-slider"' +
          ' min="0" max="' + (q.steps.length - 1) + '" value="' + val + '" style="--pct:' + ((val / (q.steps.length - 1)) * 100) + '%">' +
        '<div class="morpho-labels"><span>Moins</span><span>Plus</span></div>' +
        '<div class="feedback-box" id="step-fb">' +
          '<div class="feedback-box-text">' + q.feedbacks[val] + '</div>' +
        '</div>';
    }
    return '';
  },

  bindQuestion: function(q) {
    var self = this;

    // Bind choice clicks
    var choiceItems = document.querySelectorAll('.choice-item');
    for (var ci = 0; ci < choiceItems.length; ci++) {
      (function(item) {
        item.addEventListener('click', function() {
          var key = item.getAttribute('data-key');
          var value = item.getAttribute('data-value');
          var multi = item.getAttribute('data-multi') === 'true';
          self.selectChoice(key, value, multi);
        });
      })(choiceItems[ci]);
    }

    if (q.type === 'ruler') {
      this.initRuler(q);
    }
    if (q.type === 'morpho') {
      var slider = document.getElementById('morpho-slider');
      if (slider) {
        slider.addEventListener('input', function() {
          var val = slider.value / 100;
          self.data[q.key] = val;
          slider.style.setProperty('--pct', slider.value + '%');
          var fb = null;
          for (var i = 0; i < q.feedback.length; i++) {
            if (val >= q.feedback[i].range[0] && val <= q.feedback[i].range[1]) { fb = q.feedback[i]; break; }
          }
          if (!fb) fb = q.feedback[0];
          var fbEl = document.getElementById('morpho-fb');
          if (fbEl) fbEl.innerHTML =
            '<div class="feedback-box-title" style="color:' + fb.color + '">' + fb.label + ' \u2014 ' + fb.value + '</div>' +
            '<div class="feedback-box-text">' + fb.desc + '</div>';
        });
        self.data[q.key] = slider.value / 100;
      }
    }
    if (q.type === 'slider-steps') {
      var slider = document.getElementById('step-slider');
      if (slider) {
        slider.addEventListener('input', function() {
          var val = parseInt(slider.value);
          self.data[q.key] = val;
          slider.style.setProperty('--pct', (val / (q.steps.length - 1) * 100) + '%');
          var sv = document.getElementById('step-val');
          if (sv) sv.textContent = q.steps[val];
          var fb = document.getElementById('step-fb');
          if (fb) fb.innerHTML = '<div class="feedback-box-text">' + q.feedbacks[val] + '</div>';
        });
        self.data[q.key] = parseInt(slider.value);
      }
    }
  },

  initRuler: function(q) {
    var self = this;
    var track = document.getElementById('ruler-track');
    var ticks = document.getElementById('ruler-ticks');
    var valEl = document.getElementById('ruler-val');
    if (!track || !ticks) return;

    var val = this.data[q.key] || q.default;
    var TICK_W = 12;

    var html = '';
    for (var i = q.min; i <= q.max; i++) {
      var major = i % 10 === 0;
      html += '<div class="ruler-tick ' + (major ? 'ruler-tick--major' : 'ruler-tick--minor') + '" data-v="' + i + '"></div>';
    }
    ticks.innerHTML = html;

    var idx = val - q.min;
    var centerX = track.offsetWidth / 2;
    track.scrollLeft = idx * TICK_W - centerX + TICK_W / 2;

    track.addEventListener('scroll', function() {
      var scrollCenter = track.scrollLeft + track.offsetWidth / 2;
      var newVal = Math.round(scrollCenter / TICK_W) + q.min;
      var clamped = Math.min(q.max, Math.max(q.min, newVal));
      if (valEl) valEl.textContent = clamped;
      self.data[q.key] = clamped;
    });
    self.data[q.key] = val;
  },

  selectChoice: function(key, value, multi) {
    if (multi) {
      if (!this.data[key]) this.data[key] = [];
      var idx = this.data[key].indexOf(value);
      if (idx >= 0) {
        this.data[key].splice(idx, 1);
      } else {
        if (value === 'aucun') {
          this.data[key] = ['aucun'];
        } else {
          this.data[key] = this.data[key].filter(function(v) { return v !== 'aucun'; });
          this.data[key].push(value);
        }
      }
    } else {
      this.data[key] = value;
    }
    this.render();
  },

  next: function() {
    var q = this.questions[this.sub];
    if (q && q.type === 'text') {
      var inp = document.getElementById('q-input');
      if (inp) this.data[q.key] = inp.value;
    }
    this.sub++;
    if (this.sub >= this.questions.length) {
      this.showLoading();
    } else {
      this.render();
    }
  },

  back: function() {
    if (this.sub > 0) { this.sub--; this.render(); }
    else { window.history.back(); }
  },

  showLoading: function() {
    var self = this;
    var app = document.getElementById('app');
    var prenom = this.data.prenom || 'toi';
    var items = [
      'Analyse des donn\u00e9es corporelles',
      'Calcul de ton niveau',
      'S\u00e9lection des exercices',
      'Objectif et concentration',
      'Cr\u00e9ation de ton programme'
    ];

    var loadingHtml = '';
    for (var i = 0; i < items.length; i++) {
      loadingHtml +=
        '<div class="loading-item" id="li-' + i + '">' +
          '<div style="display:flex;align-items:center;margin-bottom:6px">' +
            '<span class="loading-label">' + items[i] + '</span>' +
            '<span class="loading-check" id="lc-' + i + '">\u2713</span>' +
          '</div>' +
          '<div class="loading-bar-track">' +
            '<div class="loading-bar-fill" id="lb-' + i + '"></div>' +
          '</div>' +
        '</div>';
    }

    app.innerHTML =
      '<div class="ob-page ob-page--center">' +
        '<h2 style="font-size:22px;font-weight:800;text-align:center;margin-bottom:8px">' +
          'Ton coach cr\u00e9e ton programme...' +
        '</h2>' +
        '<p style="text-align:center;color:var(--text-500);margin-bottom:32px">' +
          'Personnalis\u00e9 pour ' + prenom +
        '</p>' +
        '<div id="loading-items">' + loadingHtml + '</div>' +
      '</div>';

    // Animation sequentielle
    var idx = 0;
    var animate = function() {
      if (idx >= items.length) {
        setTimeout(function() { self.showResult(); }, 600);
        return;
      }
      var bar = document.getElementById('lb-' + idx);
      var check = document.getElementById('lc-' + idx);
      if (bar) {
        setTimeout(function() { bar.style.width = '100%'; }, 50);
        var currentIdx = idx;
        setTimeout(function() {
          var c = document.getElementById('lc-' + currentIdx);
          if (c) c.style.opacity = '1';
          idx++;
          setTimeout(animate, 200);
        }, 700);
      }
    };
    setTimeout(animate, 300);

    // Sauvegarder les donnees
    if (typeof SW !== 'undefined') {
      SW.save('userProfile', this.data);
      SW.save('userStats', {
        poids: this.data.poids,
        taille: this.data.taille,
        tractions: this.data.niveau_tractions === 'avance' ? 8 : this.data.niveau_tractions === 'debutant' ? 3 : 0,
        pompes: this.data.niveau_pompes === 'avance' ? 15 : this.data.niveau_pompes === 'intermediaire' ? 8 : 3,
        niveau: this.data.niveau_pompes === 'avance' ? 'intermediaire' : 'debutant',
        prenom: this.data.prenom
      });
    }
  },

  showResult: function() {
    var poids = this.data.poids || 75;
    var poidsCible = this.data.poids_cible || 70;
    var today = new Date();
    var targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 28);

    var targetStr = targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    var targetShort = targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    var niveau = 'D\u00e9butant';
    if (this.data.niveau_pompes === 'avance') niveau = 'Avanc\u00e9';
    else if (this.data.niveau_pompes === 'intermediaire') niveau = 'Interm\u00e9diaire';

    var freq = '3\u00d7/semaine';
    if (this.data.frequence !== undefined) {
      freq = ['1\u00d7', '2\u00d7', '3\u00d7', '4\u00d7', '5\u00d7', '6\u00d7'][this.data.frequence] + '/semaine';
    }

    // Summary rows
    var summaryData = [
      ['Zone cibl\u00e9e', 'CORPS COMPLET'],
      ['Niveau', niveau],
      ['Dur\u00e9e', '20\u201345 min/s\u00e9ance'],
      ['Fr\u00e9quence', freq]
    ];
    var summaryHtml = '';
    for (var i = 0; i < summaryData.length; i++) {
      summaryHtml += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
        '<span style="color:var(--text-500)">' + summaryData[i][0] + '</span>' +
        '<strong>' + summaryData[i][1] + '</strong>' +
      '</div>';
    }

    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="ob-page" style="overflow-y:auto">' +
        '<div class="ob-content">' +
          '<p style="text-align:center;color:var(--text-500);margin-bottom:4px">D\'apr\u00e8s tes r\u00e9ponses,</p>' +
          '<h2 style="text-align:center;margin-bottom:4px">Retrouve ton meilleur toi le</h2>' +
          '<h2 style="text-align:center;color:var(--blue);margin-bottom:24px">' + targetStr + '</h2>' +
          '<svg class="projection-curve" viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
              '<linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">' +
                '<stop offset="0%" stop-color="#EF4444"/>' +
                '<stop offset="60%" stop-color="#8B5CF6"/>' +
                '<stop offset="100%" stop-color="#06B6D4"/>' +
              '</linearGradient>' +
            '</defs>' +
            '<path d="M20,20 C60,20 80,100 200,110 C240,113 280,115 300,115" fill="none" stroke="url(#curveGrad)" stroke-width="4" stroke-linecap="round"/>' +
            '<circle cx="20" cy="20" r="6" fill="#EF4444"/>' +
            '<circle cx="200" cy="110" r="8" fill="white" stroke="#2563EB" stroke-width="3"/>' +
            '<rect x="140" y="80" width="110" height="28" rx="14" fill="#2563EB"/>' +
            '<text x="196" y="99" text-anchor="middle" fill="white" font-size="13" font-weight="700">Corps de r\u00eave</text>' +
            '<text x="20" y="135" fill="#94A3B8" font-size="11">Aujourd\'hui</text>' +
            '<text x="170" y="135" fill="#0F172A" font-size="11" font-weight="600">' + targetShort + '</text>' +
            '<text x="16" y="16" fill="#94A3B8" font-size="11">' + poids + ' kg</text>' +
          '</svg>' +
          '<div class="card" style="margin:16px 0">' +
            '<h3 style="margin-bottom:12px">Routine de remise en forme</h3>' +
            this.renderMiniCal(today, targetDate) +
          '</div>' +
          '<div class="card card--elevated" style="margin-bottom:16px">' +
            '<h3 style="margin-bottom:16px">R\u00e9sum\u00e9 du plan</h3>' +
            summaryHtml +
          '</div>' +
        '</div>' +
        '<div class="ob-bottom">' +
          '<a href="dashboard.html" class="btn btn-primary btn--full">Obtenir mon programme &#8594;</a>' +
        '</div>' +
      '</div>';
  },

  renderMiniCal: function(start, end) {
    var days = [];
    var cur = new Date(start);
    for (var i = 0; i < 28; i++) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    var heads = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px">';
    for (var h = 0; h < heads.length; h++) {
      html += '<div style="text-align:center;font-size:10px;font-weight:600;color:var(--text-300);padding:4px">' + heads[h] + '</div>';
    }
    html += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">';

    var firstDay = start.getDay();
    for (var p = 0; p < firstDay; p++) {
      html += '<div></div>';
    }

    for (var d = 0; d < days.length; d++) {
      var isStart = d === 0;
      var isEnd = d === days.length - 1;
      html += '<div style="aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;' +
        'align-items:center;justify-content:center;font-size:12px;font-weight:500;' +
        'background:' + (isStart || isEnd ? 'var(--blue)' : 'var(--bg)') + ';' +
        'color:' + (isStart || isEnd ? 'white' : 'var(--text-700)') + '">' +
        (isStart ? '<span style="font-size:7px;font-weight:700">D\u00c9BUT</span>' : '') +
        (isEnd ? '<span style="font-size:7px;font-weight:700">SUCC\u00c8S</span>' : '') +
        days[d].getDate() +
      '</div>';
    }

    html += '</div>';
    return html;
  },

  init: function() {
    // Verifier si deja onboarde
    if (typeof SW !== 'undefined') {
      var existing = SW.load('userProfile');
      if (existing && existing.prenom) {
        window.location.href = 'dashboard.html';
        return;
      }
    }
    this.render();
  }
};

document.addEventListener('DOMContentLoaded', function() { OB.init(); });

// js/onboarding.js â€” Onboarding questionnaire 8 Ã©tapes

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SVG Silhouettes morphologie
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _obBodyPath(sx, wx, hx) {
  // cx=30, viewBox 60x130
  // sx=Ã©paule demi-largeur, wx=taille demi-largeur, hx=hanche demi-largeur
  var cx = 30, shY = 28, waY = 56, hiY = 74, crY = 82, ftY = 122;
  var lO = 13, lI = 5, nkW = 4;
  var d = 'M' + (cx - nkW) + ',19 ';
  d += 'L' + (cx - sx)  + ',' + shY + ' ';
  d += 'C' + (cx - sx)  + ',' + (waY - 10) + ' ' + (cx - wx) + ',' + (waY - 4) + ' ' + (cx - wx) + ',' + waY + ' ';
  d += 'C' + (cx - wx)  + ',' + (waY + 6)  + ' ' + (cx - hx) + ',' + (hiY - 3) + ' ' + (cx - hx) + ',' + hiY + ' ';
  if (hx > lO) {
    d += 'C' + (cx - hx) + ',' + (crY - 4) + ' ' + (cx - lO) + ',' + (crY - 1) + ' ' + (cx - lO) + ',' + crY + ' ';
  } else {
    d += 'L' + (cx - lO) + ',' + crY + ' ';
  }
  d += 'L' + (cx - lO) + ',' + ftY + ' ';
  d += 'L' + (cx - lI) + ',' + ftY + ' ';
  d += 'L' + (cx - lI) + ',' + crY + ' ';
  d += 'Q' + cx       + ',' + (crY + 3) + ' ' + (cx + lI) + ',' + crY + ' ';
  d += 'L' + (cx + lI) + ',' + ftY + ' ';
  d += 'L' + (cx + lO) + ',' + ftY + ' ';
  d += 'L' + (cx + lO) + ',' + crY + ' ';
  if (hx > lO) {
    d += 'C' + (cx + lO) + ',' + (crY - 1) + ' ' + (cx + hx) + ',' + (crY - 4) + ' ' + (cx + hx) + ',' + hiY + ' ';
  } else {
    d += 'L' + (cx + hx) + ',' + hiY + ' ';
  }
  d += 'C' + (cx + hx) + ',' + (hiY - 3) + ' ' + (cx + wx) + ',' + (waY + 6)  + ' ' + (cx + wx) + ',' + waY + ' ';
  d += 'C' + (cx + wx) + ',' + (waY - 4)  + ' ' + (cx + sx) + ',' + (waY - 10) + ' ' + (cx + sx) + ',' + shY + ' ';
  d += 'L' + (cx + nkW) + ',19 Z';
  return d;
}

var _MORPHO_PARAMS = [
  [14,  8, 11],  // 0: TrÃ¨s athlÃ©tique
  [14, 10, 13],  // 1: AthlÃ©tique
  [14, 12, 14],  // 2: Svelte
  [15, 14, 15],  // 3: Normal
  [15, 17, 17],  // 4: EnveloppÃ©
  [16, 20, 19],  // 5: Corpulent
  [17, 23, 20]   // 6: Fort
];
var _MORPHO_LABELS = [
  'TrÃ¨s athlÃ©tique', 'AthlÃ©tique', 'Svelte', 'Normal', 'EnveloppÃ©', 'Corpulent', 'Fort'
];

function _obMorphoSVG(idx, active) {
  var p = _MORPHO_PARAMS[idx];
  var d = _obBodyPath(p[0], p[1], p[2]);
  var fill = active ? '#2563EB' : '#CBD5E1';
  return '<svg viewBox="0 0 60 130" width="56" height="72" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="30" cy="10" r="9" fill="' + fill + '"/>' +
    '<path d="' + d + '" fill="' + fill + '"/>' +
    '</svg>';
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Objet principal OB
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
var OB = {
  step: 0,
  data: {},

  QUESTIONS: [
    {
      id: 'motivation', step: '01', label: 'MOTIVATION',
      type: 'choice-single',
      title: 'Qu\'est-ce qui te motive \u00e0 te lancer\u00a0?',
      choices: [
        { value: 'perte_poids',   label: 'Perdre du poids',        icon: '\uD83D\uDD25' },
        { value: 'muscle',        label: 'Prendre du muscle',       icon: '\uD83D\uDCAA' },
        { value: 'skills',        label: 'Apprendre des figures',   icon: '\uD83E\uDD38' },
        { value: 'sante',         label: '\u00catre en bonne sant\u00e9', icon: '\u2764\uFE0F' },
        { value: 'stress',        label: 'R\u00e9duire le stress',   icon: '\uD83E\uDDD8' },
        { value: 'defi',          label: 'Me challenger',           icon: '\uD83C\uDFC6' }
      ]
    },
    {
      id: 'skills', step: '02', label: 'OBJECTIFS',
      type: 'choice-multi',
      title: 'Quels mouvements veux-tu ma\u00eeteriser\u00a0?',
      choices: [
        { value: 'muscle_up',   label: 'Muscle Up',       icon: '\u2B06\uFE0F' },
        { value: 'front_lever', label: 'Front Lever',     icon: '\u2194\uFE0F' },
        { value: 'handstand',   label: 'Handstand',       icon: '\uD83E\uDD32' },
        { value: 'planche',     label: 'Planche',         icon: '\u2708\uFE0F' },
        { value: 'l_sit',       label: 'L-Sit',           icon: '\uD83D\uDCCF' },
        { value: 'dips',        label: 'Dips / Traction', icon: '\uD83D\uDD01' }
      ]
    },
    {
      id: 'anneeNaissance', step: '03', label: 'TON PROFIL',
      type: 'drum',
      title: 'Quelle est ton <span>ann\u00e9e de naissance</span>\u00a0?',
      min: 1960, max: 2010, default: 1995
    },
    {
      id: 'taille', step: '04', label: 'TON CORPS',
      type: 'ruler',
      title: 'Quelle est ta <span>taille</span>\u00a0?',
      unit: 'cm', min: 140, max: 220, default: 175
    },
    {
      id: 'poids', step: '05', label: 'TON CORPS',
      type: 'ruler',
      title: 'Quel est ton <span>poids</span>\u00a0?',
      unit: 'kg', min: 40, max: 150, default: 75, showBMI: true
    },
    {
      id: 'morphologie', step: '06', label: 'MORPHOLOGIE',
      type: 'morpho',
      title: 'Quelle est ta <span>silhouette</span> actuelle\u00a0?',
      default: 3
    },
    {
      id: 'niveau', step: '07', label: 'FITNESS',
      type: 'choice-single',
      title: 'Quel est ton <span>niveau</span> actuel\u00a0?',
      choices: [
        { value: 'debutant',      label: 'D\u00e9butant',      sublabel: 'Je d\u00e9bute ou peu actif',              icon: '\uD83C\uDF31' },
        { value: 'intermediaire', label: 'Interm\u00e9diaire', sublabel: 'Je m\'entra\u00eene parfois',             icon: '\u26A1' },
        { value: 'avance',        label: 'Avanc\u00e9',        sublabel: 'Je m\'entra\u00eene r\u00e9guli\u00e8rement', icon: '\uD83D\uDD25' },
        { value: 'elite',         label: '\u00c9lite',         sublabel: 'Sportif de haut niveau',                  icon: '\uD83C\uDFC6' }
      ]
    },
    {
      id: 'frequence', step: '08', label: 'PROGRAMME',
      type: 'choice-single',
      title: '\u00c0 quelle <span>fr\u00e9quence</span> veux-tu t\'entra\u00eener\u00a0?',
      choices: [
        { value: 1, label: '1 fois par semaine',    sublabel: 'Pour commencer doucement',   icon: '\uD83D\uDE0C' },
        { value: 2, label: '2 fois par semaine',    sublabel: 'Rythme confortable',          icon: '\uD83D\uDC4D' },
        { value: 3, label: '3 fois par semaine',    sublabel: 'Recommand\u00e9 pour progresser', icon: '\u2B50' },
        { value: 4, label: '4 fois par semaine',    sublabel: 'Entra\u00eenement intensif',   icon: '\uD83D\uDCAA' },
        { value: 5, label: '5 fois ou plus',        sublabel: 'Mode athl\u00e8te',           icon: '\uD83C\uDFC5' }
      ]
    }
  ],

  // â”€â”€ Render frame â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  render: function () {
    var self = this;
    var q = this.QUESTIONS[this.step];
    var n = this.QUESTIONS.length;
    var segs = '';
    for (var i = 0; i < n; i++) {
      var cls = i < this.step ? 'ob-progress-seg--done' : (i === this.step ? 'ob-progress-seg--active' : '');
      segs += '<div class="ob-progress-seg ' + cls + '"></div>';
    }
    var answered = this._isAnswered(q);
    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="ob-page">' +
        '<div class="ob-top">' +
          '<button class="ob-back-btn" id="ob-back">&#8592;</button>' +
          '<div class="ob-step-info">' +
            '<span class="ob-step-label">' + q.step + ' &nbsp; ' + q.label + '</span>' +
            '<div class="ob-progress">' + segs + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ob-content">' +
          '<h1 class="ob-question-title">' + q.title + '</h1>' +
          '<div id="question-body">' + this._renderQuestion(q) + '</div>' +
        '</div>' +
        '<div class="ob-bottom">' +
          '<button class="btn-suivant" id="btn-next"' + (answered ? '' : ' disabled') + '>SUIVANT</button>' +
        '</div>' +
      '</div>';
    document.getElementById('ob-back').addEventListener('click', function () { self.back(); });
    document.getElementById('btn-next').addEventListener('click', function () { self.next(); });
    this._bind(q);
  },

  _isAnswered: function (q) {
    if (q.type === 'drum' || q.type === 'ruler' || q.type === 'morpho') return true;
    if (q.type === 'choice-single') return this.data[q.id] !== undefined;
    if (q.type === 'choice-multi')  return Array.isArray(this.data[q.id]) && this.data[q.id].length > 0;
    return true;
  },

  // â”€â”€ Render question content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  _renderQuestion: function (q) {
    if (q.type === 'choice-single' || q.type === 'choice-multi') return this._renderChoices(q);
    if (q.type === 'drum')   return this._renderDrum(q);
    if (q.type === 'ruler')  return this._renderRuler(q);
    if (q.type === 'morpho') return this._renderMorpho(q);
    return '';
  },

  _renderChoices: function (q) {
    var sel = this.data[q.id];
    var multi = q.type === 'choice-multi';
    var html = '';
    for (var i = 0; i < q.choices.length; i++) {
      var c = q.choices[i];
      var active = multi
        ? (Array.isArray(sel) && sel.indexOf(c.value) !== -1)
        : sel === c.value;
      var valStr = typeof c.value === 'number' ? String(c.value) : c.value;
      html +=
        '<div class="ob-choice' + (active ? ' ob-choice--active' : '') + '"' +
        ' data-value="' + valStr + '" data-isnum="' + (typeof c.value === 'number') + '" data-multi="' + multi + '">' +
        '<div class="ob-choice-icon">' + (c.icon || '&#9671;') + '</div>' +
        '<div class="ob-choice-text">' +
          '<div class="ob-choice-label">' + c.label + '</div>' +
          (c.sublabel ? '<div class="ob-choice-sublabel">' + c.sublabel + '</div>' : '') +
        '</div>' +
        '<div class="ob-choice-check"></div>' +
        '</div>';
    }
    return '<div class="ob-choices-list">' + html + '</div>';
  },

  _renderDrum: function (q) {
    var items = '';
    for (var yr = q.min; yr <= q.max; yr++) {
      items += '<li class="drum-picker-item" data-val="' + yr + '">' + yr + '</li>';
    }
    return '<div class="drum-picker-wrap">' +
      '<div class="drum-picker-selection"></div>' +
      '<div class="drum-picker-fade drum-picker-fade--top"></div>' +
      '<div class="drum-picker-fade drum-picker-fade--bottom"></div>' +
      '<div class="drum-picker-scroll" id="drum-scroll">' +
        '<ul class="drum-picker-list" id="drum-list">' + items + '</ul>' +
      '</div>' +
    '</div>';
  },

  _renderRuler: function (q) {
    var val = this.data[q.id] !== undefined ? this.data[q.id] : q.default;
    var ticks = '';
    for (var v = q.min; v <= q.max; v++) {
      var major = v % 10 === 0;
      ticks += '<div class="ruler-tick' + (major ? ' ruler-tick--major' : '') + '" data-v="' + v + '">' +
        (major ? '<span class="ruler-tick-label">' + v + '</span>' : '') +
      '</div>';
    }
    var bmiHtml = '';
    if (q.showBMI) {
      bmiHtml = '<div id="bmi-display" class="bmi-badge">' + this._bmiHTML(val, this.data.taille || 175) + '</div>';
    }
    return '<div class="ruler-value-display">' +
        '<span class="ruler-value-number" id="ruler-val">' + val + '</span>' +
        '<span class="ruler-value-unit">' + q.unit + '</span>' +
      '</div>' +
      bmiHtml +
      '<div class="ruler-wrap" id="ruler-wrap">' +
        '<div class="ruler-track" id="ruler-track">' +
          '<div class="ruler-ticks" id="ruler-ticks">' + ticks + '</div>' +
        '</div>' +
        '<div class="ruler-center-line"></div>' +
      '</div>';
  },

  _bmiHTML: function (poids, taille) {
    var h = taille / 100;
    var bmi = (poids / (h * h)).toFixed(1);
    var label, color;
    if      (bmi < 18.5) { label = 'Insuffisance pond\u00e9rale'; color = '#3B82F6'; }
    else if (bmi < 25)   { label = 'Poids normal \u2713';          color = '#10B981'; }
    else if (bmi < 30)   { label = 'Surpoids';                     color = '#F59E0B'; }
    else                 { label = 'Ob\u00e9sit\u00e9';            color = '#EF4444'; }
    return '<span style="color:' + color + '">IMC</span> <strong>' + bmi + '</strong> \u2014 ' + label;
  },

  _renderMorpho: function (q) {
    var val = this.data[q.id] !== undefined ? this.data[q.id] : q.default;
    var items = '';
    for (var i = 0; i < 7; i++) {
      items +=
        '<div class="morpho-item' + (i === val ? ' morpho-item--active' : '') + '" data-idx="' + i + '">' +
          _obMorphoSVG(i, i === val) +
          '<span class="morpho-item-label">' + _MORPHO_LABELS[i] + '</span>' +
        '</div>';
    }
    return '<div class="morpho-track" id="morpho-track">' + items + '</div>' +
      '<div class="ob-morpho-label" id="morpho-cur">' + _MORPHO_LABELS[val] + '</div>';
  },

  // â”€â”€ Bind interactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  _bind: function (q) {
    var self = this;
    if (q.type === 'choice-single' || q.type === 'choice-multi') {
      var items = document.querySelectorAll('.ob-choice');
      for (var ci = 0; ci < items.length; ci++) {
        (function (item) {
          item.addEventListener('click', function () {
            var raw = item.getAttribute('data-value');
            var isNum = item.getAttribute('data-isnum') === 'true';
            var multi = item.getAttribute('data-multi') === 'true';
            var val = isNum ? Number(raw) : raw;
            self._selectChoice(q, val, multi);
          });
        })(items[ci]);
      }
    }
    if (q.type === 'drum')   this._initDrum(q);
    if (q.type === 'ruler')  this._initRuler(q);
    if (q.type === 'morpho') this._initMorpho(q);
  },

  _selectChoice: function (q, val, multi) {
    if (multi) {
      if (!Array.isArray(this.data[q.id])) this.data[q.id] = [];
      var idx = this.data[q.id].indexOf(val);
      if (idx >= 0) {
        this.data[q.id].splice(idx, 1);
      } else {
        this.data[q.id].push(val);
      }
    } else {
      this.data[q.id] = val;
    }
    this.render();
  },

  // â”€â”€ Drum picker (iOS scroll-snap) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  _initDrum: function (q) {
    var self = this;
    var scroll = document.getElementById('drum-scroll');
    if (!scroll) return;
    var ITEM_H = 44;
    var val = this.data[q.id] !== undefined ? this.data[q.id] : q.default;
    this.data[q.id] = val;
    var targetIdx = val - q.min;
    setTimeout(function () {
      scroll.scrollTop = targetIdx * ITEM_H;
      self._drumHighlight(scroll, targetIdx);
    }, 20);
    var ticking = false;
    scroll.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var idx = Math.round(scroll.scrollTop / ITEM_H);
          idx = Math.min(q.max - q.min, Math.max(0, idx));
          self.data[q.id] = q.min + idx;
          self._drumHighlight(scroll, idx);
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  _drumHighlight: function (scroll, activeIdx) {
    var items = scroll.querySelectorAll('.drum-picker-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('drum-picker-item--selected', i === activeIdx);
    }
  },

  // â”€â”€ Ruler horizontal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  _initRuler: function (q) {
    var self = this;
    var track = document.getElementById('ruler-track');
    if (!track) return;
    var TICK_W = 12;
    var val = this.data[q.id] !== undefined ? this.data[q.id] : q.default;
    this.data[q.id] = val;
    setTimeout(function () {
      track.scrollLeft = (val - q.min) * TICK_W;
    }, 20);
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var idx = Math.round(track.scrollLeft / TICK_W);
          idx = Math.min(q.max - q.min, Math.max(0, idx));
          var newVal = q.min + idx;
          self.data[q.id] = newVal;
          var el = document.getElementById('ruler-val');
          if (el) el.textContent = newVal;
          if (q.showBMI) {
            var bmiEl = document.getElementById('bmi-display');
            if (bmiEl) bmiEl.innerHTML = self._bmiHTML(newVal, self.data.taille || 175);
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  // â”€â”€ Morpho silhouettes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  _initMorpho: function (q) {
    var self = this;
    var track = document.getElementById('morpho-track');
    if (!track) return;
    var val = this.data[q.id] !== undefined ? this.data[q.id] : q.default;
    this.data[q.id] = val;
    // Scroll to active item
    setTimeout(function () {
      var items = track.querySelectorAll('.morpho-item');
      if (items[val]) {
        var itemCenter = items[val].offsetLeft + items[val].offsetWidth / 2;
        track.scrollLeft = itemCenter - track.clientWidth / 2;
      }
    }, 30);
    // Click handler
    var clickItems = track.querySelectorAll('.morpho-item');
    for (var ci = 0; ci < clickItems.length; ci++) {
      (function (item) {
        item.addEventListener('click', function () {
          var idx = parseInt(item.getAttribute('data-idx'), 10);
          self.data[q.id] = idx;
          self._morphoHighlight(track, idx);
          // Smooth scroll to clicked item
          var iCenter = item.offsetLeft + item.offsetWidth / 2;
          track.scrollTo({ left: iCenter - track.clientWidth / 2, behavior: 'smooth' });
        });
      })(clickItems[ci]);
    }
    // Scroll listener
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var center = track.scrollLeft + track.clientWidth / 2;
          var allItems = track.querySelectorAll('.morpho-item');
          var closest = 0, minDist = Infinity;
          for (var i = 0; i < allItems.length; i++) {
            var ic = allItems[i].offsetLeft + allItems[i].offsetWidth / 2;
            var dist = Math.abs(ic - center);
            if (dist < minDist) { minDist = dist; closest = i; }
          }
          if (self.data[q.id] !== closest) {
            self.data[q.id] = closest;
            self._morphoHighlight(track, closest);
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  _morphoHighlight: function (track, activeIdx) {
    var items = track.querySelectorAll('.morpho-item');
    for (var i = 0; i < items.length; i++) {
      var active = (i === activeIdx);
      items[i].classList.toggle('morpho-item--active', active);
      var fill = active ? '#2563EB' : '#CBD5E1';
      var shapes = items[i].querySelectorAll('circle, path');
      for (var s = 0; s < shapes.length; s++) { shapes[s].setAttribute('fill', fill); }
    }
    var lbl = document.getElementById('morpho-cur');
    if (lbl) lbl.textContent = _MORPHO_LABELS[activeIdx];
  },

  // â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  next: function () {
    if (this.step < this.QUESTIONS.length - 1) {
      this.step++;
      this.render();
    } else {
      this.showLoading();
    }
  },

  back: function () {
    if (this.step > 0) { this.step--; this.render(); }
    else { window.history.back(); }
  },

  // â”€â”€ Loading animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  showLoading: function () {
    var self = this;
    // Sauvegarder le profil
    if (typeof SW !== 'undefined') {
      var profile = {};
      for (var k in this.data) { if (Object.prototype.hasOwnProperty.call(this.data, k)) profile[k] = this.data[k]; }
      profile.setupDone = true;
      SW.save('userProfile', profile);
    }
    var steps = [
      'Analyse de ton profil',
      'Calcul de ton niveau',
      'S\u00e9lection des exercices',
      'Construction du planning',
      'Finalisation du programme'
    ];
    var itemsHtml = '';
    for (var i = 0; i < steps.length; i++) {
      itemsHtml +=
        '<div class="loading-item">' +
          '<div class="loading-item-header">' +
            '<span class="loading-item-label">' + steps[i] + '</span>' +
            '<span class="loading-check" id="lc-' + i + '">\u2713</span>' +
          '</div>' +
          '<div class="loading-bar-track">' +
            '<div class="loading-bar-fill" id="lb-' + i + '"></div>' +
          '</div>' +
        '</div>';
    }
    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="ob-page ob-loading">' +
        '<h2 style="font-size:22px;font-weight:800;text-align:center;margin-bottom:8px;color:#0F172A">' +
          'Ton programme se pr\u00e9pare...' +
        '</h2>' +
        '<p style="text-align:center;color:#64748B;margin-bottom:32px">Personnalis\u00e9 pour toi</p>' +
        '<div style="width:100%;max-width:360px">' + itemsHtml + '</div>' +
      '</div>';
    var idx = 0;
    function runNext() {
      if (idx >= steps.length) { setTimeout(function () { self.showResult(); }, 500); return; }
      var bar = document.getElementById('lb-' + idx);
      if (bar) {
        setTimeout(function () { bar.style.width = '100%'; }, 50);
        var cur = idx;
        setTimeout(function () {
          var check = document.getElementById('lc-' + cur);
          if (check) check.style.opacity = '1';
          idx++;
          setTimeout(runNext, 180);
        }, 760);
      }
    }
    setTimeout(runNext, 300);
  },

  // â”€â”€ RÃ©sumÃ© final â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  showResult: function () {
    var niveauMap = { debutant: 'D\u00e9butant', intermediaire: 'Interm\u00e9diaire', avance: 'Avanc\u00e9', elite: '\u00c9lite' };
    var niveau = niveauMap[this.data.niveau] || 'D\u00e9butant';
    var morphoLabel = _MORPHO_LABELS[this.data.morphologie !== undefined ? this.data.morphologie : 3];
    var age = new Date().getFullYear() - (this.data.anneeNaissance || 1995);
    var taille = this.data.taille || 175;
    var poids  = this.data.poids  || 75;
    var freq   = this.data.frequence || 3;
    var h = taille / 100;
    var bmi = (poids / (h * h)).toFixed(1);
    var rows = [
      ['Niveau',             niveau],
      ['\u00c2ge',            age + ' ans'],
      ['Taille',             taille + ' cm'],
      ['Poids',              poids + ' kg'],
      ['IMC',                bmi],
      ['Silhouette',         morphoLabel],
      ['Fr\u00e9quence',     freq + '\u00d7/semaine']
    ];
    var rowsHtml = '';
    for (var i = 0; i < rows.length; i++) {
      rowsHtml +=
        '<div class="ob-summary-row">' +
          '<span class="ob-summary-label">' + rows[i][0] + '</span>' +
          '<span class="ob-summary-value">'  + rows[i][1] + '</span>' +
        '</div>';
    }
    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="ob-page" style="overflow-y:auto">' +
        '<div class="ob-content">' +
          '<div style="text-align:center;margin:32px 0 20px">' +
            '<div style="font-size:52px;margin-bottom:12px">\uD83C\uDFAF</div>' +
            '<h2 style="font-size:22px;font-weight:800;color:#0F172A;margin-bottom:8px">Ton programme est pr\u00eat\u00a0!</h2>' +
            '<p style="color:#64748B;font-size:15px">Voici ton profil fitness personnalis\u00e9</p>' +
          '</div>' +
          '<div class="ob-summary-card">' + rowsHtml + '</div>' +
        '</div>' +
        '<div class="ob-bottom">' +
          '<a href="index.html" class="btn-start">COMMENCER MON PROGRAMME \u2192</a>' +
        '</div>' +
      '</div>';
  },

  // â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  init: function () {
    if (typeof SW !== 'undefined') {
      var existing = SW.load('userProfile');
      if (existing && existing.setupDone) {
        window.location.href = 'index.html';
        return;
      }
    }
    this.render();
  }
};

document.addEventListener('DOMContentLoaded', function () { OB.init(); });

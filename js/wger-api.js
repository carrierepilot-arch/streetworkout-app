/* ========================================
   WGER-API.JS — Wger via Vercel Proxy (/api/wger)
   Clé d'authentification gérée server-side
   ======================================== */

var WGER_API = {
  proxyUrl: '/api/wger',
  timeout: 7000,
  cache: {},
  cacheExpiry: 3600000, /* 1 hour */

  /* Helper: fetch avec timeout via AbortController */
  _fetch: async function(url) {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, this.timeout);
    try {
      var response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch(e) {
      clearTimeout(timer);
      throw e;
    }
  },

  /* Fetch exercices avec infos complètes depuis le proxy */
  async getExercises() {
    var cacheKey = 'wger_exercises';
    var now = Date.now();
    if (this.cache[cacheKey] && (now - this.cache[cacheKey].timestamp) < this.cacheExpiry) {
      return this.cache[cacheKey].data;
    }

    try {
      /* exerciseinfo inclut muscles, équipement, catégorie en un seul appel */
      var url = this.proxyUrl + '?endpoint=exerciseinfo&params=limit%3D80%26language%3D2';
      var response = await this._fetch(url);

      if (!response.ok) throw new Error('Wger proxy error: ' + response.status);

      var data = await response.json();
      var results = data.results || [];

      var exercises = results
        .filter(function(ex) {
          /* Keep only exercises that have a French translation */
          return ex.translations && ex.translations.some(function(t) { return t.language === 2; });
        })
        .map(function(ex) {
          var frTranslation = ex.translations.find(function(t) { return t.language === 2; });
          var nom = frTranslation ? frTranslation.name : (ex.name || '');
          if (!nom || nom.trim() === '') return null;

          return {
            id: 'wger_' + ex.id,
            nom: nom,
            description: frTranslation ? frTranslation.description : '',
            muscles: _mapWgerMuscles((ex.muscles || []).map(function(m) { return m.id; })),
            equipment: _mapWgerEquipment((ex.equipment || []).map(function(e) { return e.id; })),
            difficulty: 'intermediate',
            source: 'wger',
            wger_id: ex.id
          };
        })
        .filter(Boolean);

      this.cache[cacheKey] = { data: exercises, timestamp: now };
      console.log('[Wger] Loaded', exercises.length, 'exercises (via proxy)');
      return exercises;
    } catch(e) {
      console.warn('[Wger] API failed (non-blocking):', e.message);
      return [];
    }
  }
};

/* ── Mapping helpers ── */
function _mapWgerCategory(category) {
  if (!category) return 'full_body';
  var categoryMap = {
    1: 'abs', 2: 'back', 3: 'biceps', 4: 'calves', 5: 'chest',
    6: 'forearms', 7: 'glutes', 8: 'hamstrings', 9: 'lats',
    10: 'lower_back', 11: 'middle_back', 12: 'neck', 13: 'quadriceps',
    14: 'shoulders', 15: 'traps', 16: 'triceps'
  };
  return categoryMap[category] || 'full_body';
}

function _mapWgerMuscles(muscleIds) {
  var muscleMap = {
    1: 'abdominaux', 2: 'dos', 3: 'biceps', 4: 'mollets', 5: 'poitrine',
    6: 'avant-bras', 7: 'fessiers', 8: 'ischio-jambiers', 9: 'grand-dorsal',
    10: 'lombaires', 11: 'dos-milieu', 12: 'cou', 13: 'quadriceps',
    14: 'épaules', 15: 'trapèzes', 16: 'triceps'
  };
  return (muscleIds || []).map(function(id) { return muscleMap[id] || 'unknown'; });
}

function _mapWgerEquipment(equipmentIds) {
  var equipMap = {
    1: 'barbell', 2: 'dumbbell', 3: 'cable', 4: 'bench', 5: 'pullup_bar',
    6: 'bands', 7: 'kettlebell', 8: 'medicine_ball', 9: 'bodyweight'
  };
  return (equipmentIds || []).map(function(id) { return equipMap[id] || 'unknown'; });
}

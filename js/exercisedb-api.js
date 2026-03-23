/* ========================================
   EXERCISEDB-API.JS — ExerciseDB via Vercel Proxy
   Clé API stockée server-side dans Vercel ENV
   Le client appelle /api/exercisedb (jamais RapidAPI directement)
   ======================================== */

var EXERCISEDB_API = {
  proxyUrl: '/api/exercisedb',
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

  /* Fetch all exercises (general, split into relevant bodyParts for SW) */
  async getExercises() {
    var cacheKey = 'exercisedb_all';
    var now = Date.now();
    if (this.cache[cacheKey] && (now - this.cache[cacheKey].timestamp) < this.cacheExpiry) {
      return this.cache[cacheKey].data;
    }

    /* For street workout, only fetch relevant body parts to save quota */
    var bodyParts = ['back', 'chest', 'shoulders', 'upper arms', 'upper legs', 'waist'];
    var allExercises = [];

    for (var i = 0; i < bodyParts.length; i++) {
      try {
        var exercises = await this.getByBodyPart(bodyParts[i]);
        allExercises = allExercises.concat(exercises);
      } catch(e) {
        console.warn('ExerciseDB bodyPart failed:', bodyParts[i], e.message);
      }
    }

    /* Deduplicate by id */
    var seen = {};
    allExercises = allExercises.filter(function(ex) {
      if (seen[ex.id]) return false;
      seen[ex.id] = true;
      return true;
    });

    this.cache[cacheKey] = { data: allExercises, timestamp: now };
    console.log('[ExerciseDB] Loaded', allExercises.length, 'exercises (via proxy)');
    return allExercises;
  },

  /* Fetch exercises by body part via proxy */
  async getByBodyPart(bodyPart) {
    var cacheKey = 'exercisedb_bp_' + bodyPart;
    var now = Date.now();
    if (this.cache[cacheKey] && (now - this.cache[cacheKey].timestamp) < this.cacheExpiry) {
      return this.cache[cacheKey].data;
    }

    try {
      var url = this.proxyUrl + '?filter=bodyPart&value=' + encodeURIComponent(bodyPart) + '&limit=50';
      var response = await this._fetch(url);

      if (!response.ok) return [];

      var exercises = await response.json();
      /* Handle proxy error response (still returns 200 with error key) */
      if (!Array.isArray(exercises)) return [];

      var mapped = exercises.map(function(ex) {
        return {
          id: 'exercisedb_' + ex.id,
          nom: ex.name || '',
          muscles: _mapExerciseDBMuscles(ex.target, ex.bodyPart),
          equipment: _mapExerciseDBEquipment(ex.equipment || []),
          difficulty: 'intermediate',
          source: 'exercisedb'
        };
      });

      this.cache[cacheKey] = { data: mapped, timestamp: now };
      return mapped;
    } catch(e) {
      console.warn('[ExerciseDB] bodyPart fetch failed (non-blocking):', e.message);
      return [];
    }
  },

  /* Fetch exercises by muscle target via proxy */
  async getByTarget(target) {
    var cacheKey = 'exercisedb_target_' + target;
    var now = Date.now();
    if (this.cache[cacheKey] && (now - this.cache[cacheKey].timestamp) < this.cacheExpiry) {
      return this.cache[cacheKey].data;
    }

    try {
      var url = this.proxyUrl + '?filter=target&value=' + encodeURIComponent(target) + '&limit=50';
      var response = await this._fetch(url);

      if (!response.ok) return [];

      var exercises = await response.json();
      if (!Array.isArray(exercises)) return [];

      var mapped = exercises.map(function(ex) {
        return {
          id: 'exercisedb_' + ex.id,
          nom: ex.name || '',
          muscles: _mapExerciseDBMuscles(ex.target, ex.bodyPart),
          equipment: _mapExerciseDBEquipment(ex.equipment || []),
          difficulty: 'intermediate',
          source: 'exercisedb'
        };
      });

      this.cache[cacheKey] = { data: mapped, timestamp: now };
      return mapped;
    } catch(e) {
      console.warn('[ExerciseDB] target fetch failed (non-blocking):', e.message);
      return [];
    }
  }
};

/* ── Mapping helpers ── */
function _mapExerciseDBMuscles(target, bodyPart) {
  var targetMap = {
    'abs': 'abdominaux',
    'back': 'dos',
    'biceps': 'biceps',
    'chest': 'poitrine',
    'delts': 'épaules',
    'shoulders': 'épaules',
    'forearms': 'avant-bras',
    'glutes': 'fessiers',
    'hamstrings': 'ischio-jambiers',
    'lats': 'grand-dorsal',
    'lower back': 'lombaires',
    'middle back': 'dos-milieu',
    'neck': 'cou',
    'quads': 'quadriceps',
    'quadriceps': 'quadriceps',
    'traps': 'trapèzes',
    'triceps': 'triceps',
    'calves': 'mollets'
  };

  var muscles = [];
  if (target) muscles.push(targetMap[target] || target);
  if (bodyPart) muscles.push(targetMap[bodyPart] || bodyPart);

  return Array.from(new Set(muscles)).filter(Boolean);
}

function _mapExerciseDBEquipment(equipmentList) {
  var equipMap = {
    'barbell': 'barbell',
    'dumbbell': 'dumbbell',
    'cable': 'cable',
    'band': 'bands',
    'pull-up bar': 'pullup_bar',
    'pullup bar': 'pullup_bar',
    'kettlebell': 'kettlebell',
    'medicine ball': 'medicine_ball',
    'body weight': 'bodyweight',
    'bodyweight': 'bodyweight'
  };

  return (equipmentList || []).map(function(eq) {
    return equipMap[eq.toLowerCase()] || eq.toLowerCase();
  });
}

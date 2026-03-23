/* ═══════════════════════════════════════════════════════
   SW_API — js/api.js
   Appels ExerciseDB + OpenAI via proxies Vercel
   ═══════════════════════════════════════════════════════ */

var SW_API = (function() {

  /* Mapping objectif → bodyParts ExerciseDB */
  var BODY_MAP = {
    'FORCE':          ['back','chest','upper arms','upper legs'],
    'ENDURANCE':      ['cardio','upper legs','waist'],
    'STREET WORKOUT': ['back','chest','upper arms','shoulders'],
    'MAINTIEN':       ['back','chest','upper arms','upper legs','shoulders','waist'],
    'PERTE DE POIDS': ['cardio','waist','upper legs'],
    'MUSCULATION':    ['chest','back','upper arms','upper legs','shoulders']
  };

  /* ── Fetch exercises from ExerciseDB ── */
  async function fetchExercises(objectif) {
    try {
      var res = await fetch('/api/exercisedb?path=/exercises?limit=300');
      if (!res.ok) throw new Error('API ' + res.status);
      var all = await res.json();
      if (!Array.isArray(all)) return [];

      var parts = BODY_MAP[objectif] || BODY_MAP['MAINTIEN'];
      var filtered = all.filter(function(ex) {
        return parts.indexOf(ex.bodyPart) !== -1;
      });

      return filtered.map(function(ex) {
        return {
          id: ex.id,
          name: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
          gifUrl: ex.gifUrl || ''
        };
      });
    } catch(e) {
      console.warn('ExerciseDB error:', e);
      return [];
    }
  }

  /* ── Generate programme via OpenAI ── */
  async function generateProgramme(profil, exercices) {
    var exList = exercices.slice(0, 60).map(function(e) {
      return e.name + ' (' + e.bodyPart + ', ' + e.target + ')';
    }).join(', ');

    var userPrompt =
      "Crée un programme d'entraînement pour un utilisateur avec ces données :\n" +
      "- Objectif : " + (profil.objectif || 'MAINTIEN') + "\n" +
      "- Niveau : " + (profil.niveau || 'Débutant') + "\n" +
      "- Fréquence : " + (profil.frequence || 3) + " jours par semaine\n" +
      "- Jours : " + (profil.jours ? profil.jours.join(', ') : 'lun, mer, ven') + "\n" +
      "- Âge : " + (profil.age || 25) + " ans\n" +
      "- Poids : " + (profil.poids || 75) + " kg\n" +
      "- Taille : " + (profil.taille || 175) + " cm\n" +
      "- Exercices disponibles (ExerciseDB) : " + exList + "\n\n" +
      "Génère un objet JSON avec cette structure exacte :\n" +
      "{\n" +
      '  "programme": [\n' +
      "    {\n" +
      '      "jour": "Lundi",\n' +
      '      "type": "Force Haut du corps",\n' +
      '      "duree": "45 min",\n' +
      '      "exercices": [\n' +
      "        {\n" +
      '          "nom": "...",\n' +
      '          "series": 4,\n' +
      '          "reps": "8-10",\n' +
      '          "repos": "90 sec",\n' +
      '          "conseil": "..."\n' +
      "        }\n" +
      "      ]\n" +
      "    }\n" +
      "  ],\n" +
      '  "conseil_global": "..."\n' +
      "}";

    try {
      var res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: "Tu es un coach de street workout expert. Tu génères des programmes d'entraînement personnalisés, précis et motivants. Réponds UNIQUEMENT en JSON valide."
            },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!res.ok) throw new Error('OpenAI ' + res.status);
      var data = await res.json();
      var content = data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content : '';

      /* Remove markdown fences if present */
      content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      return JSON.parse(content);
    } catch(e) {
      console.warn('OpenAI error:', e);
      return null;
    }
  }

  /* ── Fallback programme (no AI) ── */
  function generateFallback(profil, exercices) {
    var jours = profil.jours || ['Lundi','Mercredi','Vendredi'];
    var freq = jours.length;

    /* Distribute exercises across days */
    var perDay = Math.min(Math.max(6, Math.floor(exercices.length / freq)), 8);
    var programme = [];
    var pool = exercices.slice();

    /* Shuffle */
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }

    var idx = 0;
    for (var d = 0; d < freq; d++) {
      var dayExs = [];
      for (var k = 0; k < perDay && idx < pool.length; k++, idx++) {
        dayExs.push({
          nom: pool[idx].name,
          series: 3 + Math.floor(Math.random() * 2),
          reps: ['8-10','10-12','12-15','6-8'][Math.floor(Math.random()*4)],
          repos: ['60 sec','90 sec','120 sec'][Math.floor(Math.random()*3)],
          conseil: ''
        });
      }

      var types = ['Force Haut du corps','Force Bas du corps','Full Body','Cardio & Core'];
      programme.push({
        jour: jours[d],
        type: types[d % types.length],
        duree: '45 min',
        exercices: dayExs
      });
    }

    return {
      programme: programme,
      conseil_global: "Programme généré automatiquement. Ajustez les charges selon vos sensations."
    };
  }

  return {
    fetchExercises: fetchExercises,
    generateProgramme: generateProgramme,
    generateFallback: generateFallback
  };

})();

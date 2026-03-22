/* ========================================
   PROGRESSION-V2.JS — Skill cards + locked levels UI
   Uses EXERCISES from progression.js
   ======================================== */

/* Show skills list (cards) */
function showSkillsList() {
  var container = document.getElementById('skills-cards');
  var detailEl = document.getElementById('skill-detail');
  var listEl = document.getElementById('skills-list');
  if (!container || !listEl || !detailEl) return;

  detailEl.style.display = 'none';
  listEl.style.display = '';

  var html = '';
  for (var i = 0; i < EXERCISES.length; i++) {
    var ex = EXERCISES[i];
    var mastered = 0;
    var total = ex.steps.length;

    for (var j = 0; j < total; j++) {
      var key = ex.id + '_' + j;
      if (_progData[key] === 'mastered' || _progData[ex.steps[j].id] === 'mastered') {
        mastered++;
      }
    }

    var pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    html +=
      '<div class="skill-card" onclick="showSkillDetail(\'' + ex.id + '\')">' +
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">' +
          '<div style="width:44px;height:44px;border-radius:12px;background:' + (ex.color || 'var(--blue)') + ';' +
            'display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:18px">' +
            ex.name.charAt(0) +
          '</div>' +
          '<div style="flex:1">' +
            '<div style="font-weight:700;font-size:16px">' + ex.name + '</div>' +
            '<div style="font-size:13px;color:var(--text-400)">' + mastered + '/' + total + ' niveaux</div>' +
          '</div>' +
          '<span style="font-size:20px;color:var(--text-300)">&#8250;</span>' +
        '</div>' +
        '<div class="skill-prog-bar">' +
          '<div class="skill-prog-fill" style="width:' + pct + '%;background:' + (ex.color || 'var(--blue)') + '"></div>' +
        '</div>' +
      '</div>';
  }

  container.innerHTML = html;
}

/* Show detail view for a single skill */
function showSkillDetail(skillId) {
  var skill = null;
  for (var i = 0; i < EXERCISES.length; i++) {
    if (EXERCISES[i].id === skillId) { skill = EXERCISES[i]; break; }
  }
  if (!skill) return;

  var listEl = document.getElementById('skills-list');
  var detailEl = document.getElementById('skill-detail');
  if (!listEl || !detailEl) return;

  listEl.style.display = 'none';
  detailEl.style.display = '';

  // Find first unlocked (not mastered) step
  var firstUnlocked = -1;
  for (var i = 0; i < skill.steps.length; i++) {
    var key = skill.id + '_' + i;
    var altKey = skill.steps[i].id;
    if (_progData[key] !== 'mastered' && _progData[altKey] !== 'mastered') {
      firstUnlocked = i;
      break;
    }
  }
  if (firstUnlocked === -1) firstUnlocked = skill.steps.length; // all mastered

  var html =
    '<button class="btn btn-ghost" onclick="showSkillsList()" style="margin-bottom:16px;font-size:15px">' +
      '&#8592; Retour' +
    '</button>' +
    '<div style="display:flex;align-items:center;gap:14px;margin-bottom:24px">' +
      '<div style="width:52px;height:52px;border-radius:14px;background:' + (skill.color || 'var(--blue)') + ';' +
        'display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:22px">' +
        skill.name.charAt(0) +
      '</div>' +
      '<div>' +
        '<h2 style="font-size:22px;font-weight:800;margin:0">' + skill.name + '</h2>' +
        '<span style="color:var(--text-400);font-size:14px">' + skill.steps.length + ' niveaux</span>' +
      '</div>' +
    '</div>';

  // Level items
  for (var i = 0; i < skill.steps.length; i++) {
    var step = skill.steps[i];
    var key = skill.id + '_' + i;
    var altKey = step.id;
    var isMastered = _progData[key] === 'mastered' || _progData[altKey] === 'mastered';
    var isActive = !isMastered && i === firstUnlocked;
    var isLocked = !isMastered && i > firstUnlocked;

    var stateClass = isMastered ? 'level-item--done' :
                     isActive ? 'level-item--active' :
                     isLocked ? 'level-item--locked' : 'level-item--unlocked';

    var statusIcon = isMastered ? '&#10003;' :
                     isLocked ? '&#128274;' : (i + 1);

    html +=
      '<div class="level-item ' + stateClass + '"' +
        (isLocked ? '' : ' onclick="toggleLevel(\'' + skill.id + '\',' + i + ')"') +
        ' style="cursor:' + (isLocked ? 'not-allowed' : 'pointer') + '">' +
        '<div class="level-num">' + statusIcon + '</div>' +
        '<div class="level-body">' +
          '<div class="level-name">' + step.name + '</div>' +
          '<div class="level-desc">' + step.desc + '</div>' +
        '</div>' +
      '</div>';
  }

  detailEl.innerHTML = html;
}

/* Toggle mastery of a level */
function toggleLevel(skillId, stepIdx) {
  var skill = null;
  for (var i = 0; i < EXERCISES.length; i++) {
    if (EXERCISES[i].id === skillId) { skill = EXERCISES[i]; break; }
  }
  if (!skill) return;

  var key = skill.id + '_' + stepIdx;
  var altKey = skill.steps[stepIdx].id;

  // Toggle mastered status
  if (_progData[key] === 'mastered' || _progData[altKey] === 'mastered') {
    _progData[key] = 'not-acquired';
    _progData[altKey] = 'not-acquired';
  } else {
    _progData[key] = 'mastered';
    _progData[altKey] = 'mastered';
  }

  // Persist to Supabase if available
  if (typeof SB !== 'undefined' && _progUserId) {
    SB.from('progression_skills').upsert({
      user_id: _progUserId,
      skill_id: altKey,
      status: _progData[altKey]
    }, { onConflict: 'user_id,skill_id' });
  }

  // Re-render detail
  showSkillDetail(skillId);
}

/* Wait for original initProgression to load data, then render v2 UI */
(function() {
  // Poll until _progData is populated by initProgression from progression.js
  var attempts = 0;
  function waitAndRender() {
    attempts++;
    // _progData is set by initProgression; check if auth has resolved
    if (_progUserId || attempts > 40) {
      showSkillsList();
    } else {
      setTimeout(waitAndRender, 150);
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Give initProgression time to load data first
    setTimeout(waitAndRender, 300);
  });
})();

/* ═══════════════════════════════════════════════════════
   FORGE Auth — js/auth.js
   Authentication avec KV Redis pour persistance multi-navigateurs
   Admin: 1@gmail.com
   ═══════════════════════════════════════════════════════ */

var SW_AUTH = (function() {
  'use strict';

  var ADMIN_EMAIL = '1@gmail.com';
  var SESSION_KEY = 'sw_session';
  var kvAvailable = null; // null = unknown, true/false after first check

  /* Hash password with WebCrypto SHA-256 → hex string */
  async function hashPwd(pwd) {
    var enc = new TextEncoder();
    var buf = await crypto.subtle.digest('SHA-256', enc.encode(pwd || ''));
    return Array.from(new Uint8Array(buf))
      .map(function(b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { return null; }
  }

  function saveSession(email) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: email }));
  }

  /* LocalStorage fallback for offline/no-KV */
  function getUsersLocal() {
    try { return JSON.parse(localStorage.getItem('sw_users')) || {}; } catch(e) { return {}; }
  }

  function saveUsersLocal(users) {
    localStorage.setItem('sw_users', JSON.stringify(users));
  }

  /* API helper */
  async function apiCall(body) {
    try {
      var r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      kvAvailable = r.status !== 503;
      return r.ok ? await r.json() : { ok: false, err: 'Erreur serveur' };
    } catch (e) {
      kvAvailable = false;
      return { ok: false, err: e.message };
    }
  }

  /* Login — tries KV first, fallback to localStorage */
  async function login(email, pwd) {
    email = (email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return { ok: false, err: 'Email invalide' };
    if (!pwd || pwd.length < 4) return { ok: false, err: 'Mot de passe trop court (4 car. min)' };

    var hash = await hashPwd(pwd);

    /* Try KV first */
    if (kvAvailable !== false) {
      var kvResult = await apiCall({ action: 'login', email: email, hash: hash });
      if (kvResult && kvResult.ok) {
        saveSession(email);
        return { ok: true };
      }
      /* If KV returned an error (not 503), show it */
      if (kvAvailable === true && kvResult && kvResult.err) {
        return kvResult;
      }
    }

    /* Fallback to localStorage */
    var users = getUsersLocal();
    if (!users[email]) return { ok: false, err: 'Aucun compte avec cet email' };
    if (users[email].hash !== hash) return { ok: false, err: 'Mot de passe incorrect' };

    saveSession(email);
    return { ok: true };
  }

  /* Register — tries KV first, fallback to localStorage */
  async function register(email, pwd) {
    email = (email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return { ok: false, err: 'Email invalide' };
    if (!pwd || pwd.length < 4) return { ok: false, err: 'Mot de passe trop court (4 car. min)' };

    var hash = await hashPwd(pwd);

    /* Try KV first */
    if (kvAvailable !== false) {
      var kvResult = await apiCall({ action: 'register', email: email, hash: hash });
      if (kvResult && kvResult.ok) {
        saveSession(email);
        return { ok: true };
      }
      /* If KV is available but returned error, show it */
      if (kvAvailable === true && kvResult && kvResult.err) {
        return kvResult;
      }
    }

    /* Fallback to localStorage */
    var users = getUsersLocal();
    if (users[email]) return { ok: false, err: 'Un compte existe déjà avec cet email' };

    users[email] = { hash: hash, since: new Date().toISOString().slice(0, 10) };
    saveUsersLocal(users);
    saveSession(email);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function getCurrentEmail() {
    var s = getSession();
    return s ? s.email : null;
  }

  function isAdmin() {
    var s = getSession();
    return !!(s && s.email === ADMIN_EMAIL);
  }

  /* Namespace a localStorage key for the current user */
  function key(base) {
    var s = getSession();
    if (!s || !s.email) return base;
    var safe = s.email.replace(/[^a-z0-9]/gi, '_');
    return base + '__' + safe;
  }

  /* Get users from KV (admin only) */
  async function getUsers() {
    if (kvAvailable === true) {
      try {
        var r = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_users', adminEmail: ADMIN_EMAIL })
        });
        if (r.ok) {
          var data = await r.json();
          return data.users || [];
        }
      } catch (e) {}
    }
    /* Fallback to localStorage */
    return Object.keys(getUsersLocal());
  }

  /* Check KV availability */
  async function checkKV() {
    if (kvAvailable !== null) return kvAvailable;
    try {
      var r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping' })
      });
      kvAvailable = r.status !== 503;
    } catch (e) {
      kvAvailable = false;
    }
    return kvAvailable;
  }

  return {
    login: login,
    register: register,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getCurrentEmail: getCurrentEmail,
    isAdmin: isAdmin,
    key: key,
    getUsers: getUsers,
    checkKV: checkKV,
    ADMIN_EMAIL: ADMIN_EMAIL
  };
})();

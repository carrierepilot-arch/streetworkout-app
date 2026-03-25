/* ═══════════════════════════════════════════════════════
   FORGE Auth — js/auth.js
   Authentication avec localStorage (KV non disponible car protégé)
   Admin: 1@gmail.com
   ═══════════════════════════════════════════════════════ */

var SW_AUTH = (function() {
  'use strict';

  var ADMIN_EMAIL = '1@gmail.com';
  var SESSION_KEY = 'sw_session';
  var kvAvailable = false; // Force localStorage car KV protégé par Vercel Auth

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

  /* LocalStorage only */
  function getUsersLocal() {
    try { return JSON.parse(localStorage.getItem('sw_users')) || {}; } catch(e) { return {}; }
  }

  function saveUsersLocal(users) {
    localStorage.setItem('sw_users', JSON.stringify(users));
  }

  /* Login — localStorage only */
  async function login(email, pwd) {
    email = (email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return { ok: false, err: 'Email invalide' };
    if (!pwd || pwd.length < 4) return { ok: false, err: 'Mot de passe trop court (4 car. min)' };

    var hash = await hashPwd(pwd);
    var users = getUsersLocal();
    
    if (!users[email]) return { ok: false, err: 'Aucun compte avec cet email' };
    if (users[email].hash !== hash) return { ok: false, err: 'Mot de passe incorrect' };

    saveSession(email);
    return { ok: true };
  }

  /* Register — localStorage only */
  async function register(email, pwd) {
    email = (email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return { ok: false, err: 'Email invalide' };
    if (!pwd || pwd.length < 4) return { ok: false, err: 'Mot de passe trop court (4 car. min)' };

    var hash = await hashPwd(pwd);
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

  /* Get users from localStorage */
  async function getUsers() {
    return Object.keys(getUsersLocal());
  }

  /* Check KV availability (always false for now) */
  async function checkKV() {
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

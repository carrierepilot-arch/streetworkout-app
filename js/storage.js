var SW_STORAGE = (function() {
  'use strict';

  function _email() {
    return (typeof SW_AUTH !== 'undefined') ? SW_AUTH.getCurrentEmail() : null;
  }
  function _userId() {
    return (typeof SW_AUTH !== 'undefined') ? SW_AUTH.getCurrentUserId() : null;
  }
  function _supa() {
    return (typeof SW_AUTH !== 'undefined') ? SW_AUTH.getSupa() : null;
  }
  function _k(base) {
    if (typeof SW_AUTH !== 'undefined' && SW_AUTH.isLoggedIn()) {
      return SW_AUTH.key(base);
    }
    return base;
  }

  return {
    save: function(key, value) {
      localStorage.setItem(_k(key), JSON.stringify(value));
      this._sync(key, value);
    },

    load: function(key) {
      try {
        var raw = localStorage.getItem(_k(key));
        return raw ? JSON.parse(raw) : null;
      } catch(e) { return null; }
    },

    update: function(key, patch) {
      var current = this.load(key) || {};
      var merged = Object.assign({}, current, patch);
      this.save(key, merged);
      return merged;
    },

    clear: function(key) {
      localStorage.removeItem(_k(key));
    },

    /* Sync une cle vers Supabase (fire and forget) */
    _sync: function(baseKey, value) {
      var userId = _userId();
      var supa   = _supa();

      if (userId && supa) {
        /* Supabase — source de verite principale */
        try {
          supa.from('user_data').upsert({
            user_id:    userId,
            key:        baseKey,
            value:      value,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' })
          .then(function() {}).catch(function() {});
        } catch(e) {}
        return;
      }

      /* Fallback : API /api/userdata */
      var email = _email();
      if (!email) return;
      var nsKey = _k(baseKey);
      try {
        fetch('/api/userdata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, key: nsKey, data: value }),
          keepalive: true
        }).catch(function() {});
      } catch(e) {}
    },

    /* Charge toutes les donnees depuis Supabase au login */
    pullFromServer: async function() {
      var userId = _userId();
      var supa   = _supa();
      var email  = _email();

      /* Supabase en priorite */
      if (userId && supa) {
        try {
          var r = await supa.from('user_data').select('key, value').eq('user_id', userId);
          if (!r.error && r.data && r.data.length > 0) {
            var safe = (email || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            r.data.forEach(function(row) {
              var nsKey = row.key + (safe ? '__' + safe : '');
              localStorage.setItem(nsKey, JSON.stringify(row.value));
            });
            return;
          }
        } catch(e) {}
      }

      /* Fallback API */
      if (!email) return;
      try {
        var res = await fetch('/api/userdata?email=' + encodeURIComponent(email));
        if (!res.ok) return;
        var all = await res.json();
        if (all && typeof all === 'object' && !all.error) {
          Object.keys(all).forEach(function(k) {
            localStorage.setItem(k, typeof all[k] === 'string' ? all[k] : JSON.stringify(all[k]));
          });
        }
      } catch(e) {}
    }
  };
})();

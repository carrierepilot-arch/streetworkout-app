var SW_STORAGE = {
  save: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  load: function(key) {
    try {
      var raw = localStorage.getItem(key);
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
    localStorage.removeItem(key);
  }
};

/* ========================================
   STORAGE.JS — LocalStorage Persistence Module
   ======================================== */

const SW = {
  save: function(key, data) {
    try {
      localStorage.setItem('sw_' + key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  load: function(key) {
    try {
      var data = localStorage.getItem('sw_' + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Storage load failed:', e);
      return null;
    }
  },

  clear: function(key) {
    localStorage.removeItem('sw_' + key);
  },

  /* Append to an array stored at key */
  append: function(key, item) {
    var arr = SW.load(key) || [];
    arr.push(item);
    SW.save(key, arr);
    return arr;
  },

  /* Remove item at index from array stored at key */
  removeAt: function(key, index) {
    var arr = SW.load(key) || [];
    if (index >= 0 && index < arr.length) {
      arr.splice(index, 1);
      SW.save(key, arr);
    }
    return arr;
  }
};

/* Toast notification helper */
function showToast(message, type) {
  type = type || 'success';
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(function() {
    toast.classList.add('show');
  });

  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}

/* Confetti celebration */
function launchConfetti(x, y) {
  var colors = ['#00FF87', '#00B4FF', '#FF6B35', '#FFFFFF', '#00CC6A'];
  for (var i = 0; i < 30; i++) {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
    piece.style.setProperty('--ty', (Math.random() - 0.8) * 400 + 'px');
    piece.style.width = (Math.random() * 8 + 4) + 'px';
    piece.style.height = (Math.random() * 8 + 4) + 'px';
    piece.style.animation = 'confetti-burst ' + (0.8 + Math.random() * 0.6) + 's ease-out forwards';
    document.body.appendChild(piece);
    (function(p) {
      setTimeout(function() { p.remove(); }, 1500);
    })(piece);
  }
}

/* Scroll reveal with IntersectionObserver */
function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function(el) {
    observer.observe(el);
  });
}

/* Animated counter */
function animateCounter(el, target, duration) {
  duration = duration || 1200;
  var start = 0;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

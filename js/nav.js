/* ========================================
   NAV.JS — Hamburger Menu + Navigation
   ======================================== */

function initNav() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuBackdrop = document.getElementById('menu-backdrop');
  var closeBtn = document.getElementById('mobile-menu-close');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    if (menuBackdrop) menuBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    if (menuBackdrop) menuBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  /* Close on Escape key */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* Close when a link inside the menu is clicked */
  var menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
}

/* Highlight active nav link based on current page */
function setActiveNav() {
  var current = window.location.pathname.split('/').pop() || 'index.html';
  
  /* Desktop nav links */
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a, .sidebar-links a, .bottom-nav a');
  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', function() {
  initNav();
  setActiveNav();
});

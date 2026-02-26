/**
 * Mobile Menu Dropdown Handler
 * Enables touch-friendly dropdown menus on mobile devices
 */

(function() {
  'use strict';

  // Handle dropdown menu toggles on mobile
  const navDropdowns = document.querySelectorAll('.nav-dropdown');

  navDropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    
    link.addEventListener('click', function(e) {
      // On mobile, prevent default and toggle dropdown
      if (window.innerWidth < 1400) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
      // On desktop, allow normal link navigation
    });
  });

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-list a');
  const menuToggle = document.getElementById('menu-toggle');

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Close the mobile menu after clicking a link
      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      navDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // Handle window resize to reset menu state
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 1400) {
      navDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
      if (menuToggle) {
        menuToggle.checked = false;
      }
    }
  });
})();

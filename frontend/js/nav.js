import { toggleTheme, updateToggleIcon } from './theme.js';
import { apiGet, apiPost } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme
  updateToggleIcon();
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
    });
  }

  // Active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('nav-link--active');
    } else if (path.startsWith('/ticket/') && href === '/tickets') {
      link.classList.add('nav-link--active');
    }
  });

  // Auth
  const authLink = document.getElementById('nav-auth-link');
  if (!authLink) return;

  apiGet('/me').then(user => {
    if (!user) return;

    window.__userRole = user.rol;
    window.__userId = user.id;

    // Convert auth link to logout button
    authLink.textContent = `Logout (${user.nombre})`;
    authLink.href = '#';
    const handleLogout = async (e) => {
      e.preventDefault();
      try { await apiPost('/logout'); } catch (_) {}
      window.location.href = '/login';
    };
    authLink.addEventListener('click', handleLogout);

    // Mobile logout link
    const logoutMobile = document.getElementById('nav-logout-m');
    if (logoutMobile) {
      logoutMobile.hidden = false;
      logoutMobile.textContent = `Cerrar sesion (${user.nombre})`;
      logoutMobile.addEventListener('click', handleLogout);
    }

    // Show/hide nav links based on role (desktop + mobile)
    if (user.rol === 'cliente') {
      showEl('nav-crear');
      showEl('nav-crear-m');
      showEl('nav-mis-tickets');
      showEl('nav-mis-tickets-m');
    } else if (user.rol === 'senior') {
      showEl('nav-crear');
      showEl('nav-crear-m');
      showEl('nav-usuarios');
      showEl('nav-usuarios-m');
    }
    // developer: nothing extra

    // Landing page buttons
    const btnVer = document.getElementById('btn-ver-landing');
    const btnCrear = document.getElementById('btn-crear-landing');
    if (btnVer) btnVer.href = '/tickets';
    if (btnCrear) {
      if (user.rol === 'developer') {
        btnCrear.hidden = true;
      } else {
        btnCrear.href = '/crear';
      }
    }
  }).catch(() => {
    // Not logged in — auth link stays as Login
    authLink.textContent = 'Login';
    authLink.href = '/login';
  });
});

function showEl(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}

import { apiGet, apiPost } from './api.js';

async function setupNav() {
  const authLink = document.getElementById('nav-auth-link');
  const navCrear = document.getElementById('nav-crear');
  const navUsuarios = document.getElementById('nav-usuarios');
  const navMisTickets = document.getElementById('nav-mis-tickets');
  if (!authLink) return;

  try {
    const user = await apiGet('/me');

    if (user) {
      authLink.textContent = `Logout (${user.nombre})`;
      authLink.href = '#';
      authLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await apiPost('/logout'); } catch (_) {}
        window.location.href = '/login';
      });

      window.__userRole = user.rol;
      window.__userId = user.id;

      if (user.rol === 'cliente') {
        if (navCrear) navCrear.style.display = '';
        if (navMisTickets) navMisTickets.style.display = '';
      } else if (user.rol === 'developer') {
        // Developer: solo Tickets (ya visible por defecto)
      } else if (user.rol === 'senior') {
        if (navCrear) navCrear.style.display = '';
        if (navUsuarios) navUsuarios.style.display = '';
      }

      // Botones del landing: redirigir a rutas reales si autenticado
      const btnCrearLanding = document.getElementById('btn-crear-landing');
      const btnVerLanding = document.getElementById('btn-ver-landing');
      if (btnVerLanding) btnVerLanding.href = '/tickets';
      if (btnCrearLanding) {
        if (user.rol === 'cliente' || user.rol === 'senior') {
          btnCrearLanding.href = '/crear';
        } else {
          btnCrearLanding.style.display = 'none';
        }
      }
    }
  } catch (err) {
    authLink.textContent = 'Login';
    authLink.href = '/login';
  }
}

document.addEventListener('DOMContentLoaded', setupNav);

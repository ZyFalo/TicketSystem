import { apiGet, apiPost } from './api.js';

async function setupNav() {
  const authLink = document.getElementById('nav-auth-link');
  if (!authLink) return;

  try {
    // Verificar sesión (el endpoint /api/me deberia existir según config o retorna 401 si no hay session)
    // Usamos el token de localStorage si existe, pero el request lo envía automático si se configuró headers
    // o simplemente si el backend usa cookies mandará el cookie y este endpoint dirá si sí o no.
    const user = await apiGet('/me');
    
    // Si llegamos aquí y es exitoso, estamos logueados
    if (user) {
      authLink.textContent = 'Logout';
      authLink.href = '#';
      authLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await apiPost('/logout'); } catch (_) {}
        window.location.href = '/login';
      });
    }
  } catch (err) {
    // 401: no autorizado (catcha desde apiGet)
    // signfica no logueado, authLink ya dice "Login" y apunta a /login
    authLink.textContent = 'Login';
    authLink.href = '/login';
  }
}

// Inicializar nav
document.addEventListener('DOMContentLoaded', setupNav);

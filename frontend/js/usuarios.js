import { apiGet, apiPatch } from './api.js';
import { showToast } from './toast.js';

const tbody = document.getElementById('usuarios-body');
const errorDiv = document.getElementById('usuarios-error');

const ROL_ACTIONS = {
  cliente: [{ label: 'Promover a Developer', target: 'developer' }],
  developer: [
    { label: 'Promover a Senior', target: 'senior' },
    { label: 'Degradar a Cliente', target: 'cliente' },
  ],
  senior: [{ label: 'Degradar a Developer', target: 'developer' }],
};

function renderUsuarios(usuarios) {
  if (!usuarios || usuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><p class="empty-title">No hay usuarios.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = usuarios.map(u => {
    const actions = ROL_ACTIONS[u.rol] || [];
    const buttons = actions.map(a =>
      `<button class="btn btn-action btn-cambiar-rol" data-id="${u.id}" data-rol="${a.target}">${a.label}</button>`
    ).join(' ');

    return `
    <tr>
      <td>${u.id}</td>
      <td class="col-title">${u.nombre}</td>
      <td>${u.email}</td>
      <td><span class="badge badge--${u.rol}">${u.rol}</span></td>
      <td>${buttons}</td>
    </tr>`;
  }).join('');

  document.querySelectorAll('.btn-cambiar-rol').forEach(btn => {
    btn.addEventListener('click', async () => {
      const userId = btn.dataset.id;
      const newRol = btn.dataset.rol;
      btn.disabled = true;
      btn.textContent = '...';
      try {
        await apiPatch(`/usuarios/${userId}/rol`, { rol: newRol });
        loadUsuarios();
      } catch (err) {
        showToast(err.data?.detail || 'Error al cambiar rol', 'error');
        btn.disabled = false;
      }
    });
  });
}

async function loadUsuarios() {
  errorDiv.textContent = '';
  try {
    const data = await apiGet('/usuarios');
    renderUsuarios(data);
  } catch (err) {
    errorDiv.textContent = err.data?.detail || 'Error al cargar usuarios.';
    tbody.innerHTML = '';
  }
}

loadUsuarios();

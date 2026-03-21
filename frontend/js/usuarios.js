import { apiGet, apiPatch } from './api.js';

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
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280; padding: 2rem;">No hay usuarios.</td></tr>`;
    return;
  }

  tbody.innerHTML = usuarios.map(u => {
    const actions = ROL_ACTIONS[u.rol] || [];
    const buttons = actions.map(a =>
      `<button class="btn btn-cambiar-rol" data-id="${u.id}" data-rol="${a.target}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin: 0.125rem;">${a.label}</button>`
    ).join(' ');

    const badgeClass = u.rol === 'senior' ? 'badge-resuelto' : u.rol === 'developer' ? 'badge-en-revision' : 'badge-pendiente';

    return `
    <tr>
      <td>${u.id}</td>
      <td style="font-weight: 500;">${u.nombre}</td>
      <td>${u.email}</td>
      <td><span class="badge ${badgeClass}">${u.rol}</span></td>
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
        alert(err.data?.detail || 'Error al cambiar rol');
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

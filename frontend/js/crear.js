import { apiGet, apiPost } from './api.js';

const form = document.getElementById('crear-ticket-form');
const btnSubmit = document.getElementById('btn-submit');
const errorDiv = document.getElementById('crear-error');
const camposClasificacion = document.getElementById('campos-clasificacion');
const seccionAsignados = document.getElementById('seccion-asignados');
const asignadosContainer = document.getElementById('asignados-checkboxes');

function waitForRole() {
  return new Promise(resolve => {
    const check = () => {
      if (window.__userRole !== undefined) return resolve();
      setTimeout(check, 50);
    };
    check();
  });
}

async function init() {
  await waitForRole();
  const rol = window.__userRole;

  if (rol === 'senior') {
    if (camposClasificacion) camposClasificacion.style.display = '';
    if (seccionAsignados) seccionAsignados.style.display = '';
    await loadOpciones();
    await loadUsuariosParaAsignar();
  }
}

async function loadOpciones() {
  try {
    const opciones = await apiGet('/tickets/opciones');
    const catSelect = document.getElementById('categoria');
    const priSelect = document.getElementById('prioridad');
    opciones.categorias.forEach(c => {
      catSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
    opciones.prioridades.forEach(p => {
      priSelect.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
    });
  } catch (_) {}
}

async function loadUsuariosParaAsignar() {
  if (!asignadosContainer) return;
  try {
    const todosUsuarios = await apiGet('/usuarios');
    const usuarios = todosUsuarios.filter(u => u.rol !== 'cliente');
    asignadosContainer.innerHTML = usuarios.map(u => `
      <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0;">
        <input type="checkbox" class="asignado-crear-check" value="${u.id}">
        ${u.nombre} <span style="color: #6b7280; font-size: 0.75rem;">(${u.rol})</span>
      </label>
    `).join('');
  } catch (_) {
    asignadosContainer.innerHTML = '<p style="color: #6b7280;">Error al cargar usuarios</p>';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const lenguaje = document.getElementById('lenguaje').value;
  const codigo = document.getElementById('codigo').value.trim();

  if (!titulo || !descripcion) {
    errorDiv.textContent = 'Por favor, completa título y descripción.';
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Creando...';
  errorDiv.textContent = '';

  const payload = {
    titulo,
    descripcion,
    fragmento_codigo: codigo ? codigo : null,
    lenguaje_codigo: codigo ? lenguaje : null,
  };

  if (window.__userRole === 'senior') {
    const catId = document.getElementById('categoria').value;
    const priId = document.getElementById('prioridad').value;
    if (catId) payload.categoria_id = parseInt(catId);
    if (priId) payload.prioridad_id = parseInt(priId);
  }

  try {
    const data = await apiPost('/tickets', payload);

    if (window.__userRole === 'senior') {
      const checks = document.querySelectorAll('.asignado-crear-check:checked');
      if (checks.length > 0 && data && data.id) {
        const usuario_ids = Array.from(checks).map(c => parseInt(c.value));
        await fetch(`/api/tickets/${data.id}/asignados`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario_ids }),
        });
      }
    }

    if (data && data.id) {
      window.location.href = `/ticket/${data.id}`;
    } else {
      window.location.href = '/tickets';
    }
  } catch (err) {
    console.error(err);
    errorDiv.textContent = err.data?.detail || 'Error al crear el ticket.';
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Crear Ticket';
  }
});

init();

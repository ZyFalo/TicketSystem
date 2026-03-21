import { apiGet, apiPost, apiPut } from './api.js';
import { showToast } from './toast.js';

const form = document.getElementById('crear-ticket-form');
const btnSubmit = document.getElementById('btn-submit');
const camposClasificacion = document.getElementById('campos-clasificacion');
const asignadosContainer = document.getElementById('asignados-checkboxes');

// Toggle code section
const toggleCodeBtn = document.getElementById('toggle-code');
const codeBody = document.getElementById('code-body');
const toggleCodeText = document.getElementById('toggle-code-text');
if (toggleCodeBtn && codeBody) {
  toggleCodeBtn.addEventListener('click', () => {
    const isOpen = codeBody.classList.toggle('is-visible');
    toggleCodeBtn.classList.toggle('is-open', isOpen);
    toggleCodeText.textContent = isOpen ? 'Contraer' : 'Expandir';
  });
}

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
    if (camposClasificacion) camposClasificacion.hidden = false;
    // Update code section number from 2 to 3
    const codeNum = document.getElementById('code-section-number');
    if (codeNum) codeNum.textContent = '3';
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
      <label class="checkbox-label">
        <input type="checkbox" class="asignado-crear-check" value="${u.id}">
        ${u.nombre} <span class="role-hint">(${u.rol})</span>
      </label>
    `).join('');
  } catch (_) {
    asignadosContainer.innerHTML = '<p class="text-muted">Error al cargar usuarios</p>';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const lenguaje = document.getElementById('lenguaje').value;
  const codigo = document.getElementById('codigo').value.trim();

  if (!titulo || !descripcion) {
    showToast('Por favor, completa título y descripción.', 'error');
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Creando...';

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
        await apiPut('/tickets/' + data.id + '/asignados', { usuario_ids });
      }
    }

    if (data && data.id) {
      window.location.href = `/ticket/${data.id}`;
    } else {
      window.location.href = '/tickets';
    }
  } catch (err) {
    console.error(err);
    showToast(err.data?.detail || 'Error al crear el ticket.', 'error');
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Crear Ticket';
  }
});

init();

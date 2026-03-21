import { apiGet, apiPatch, apiPost } from './api.js';

// Extraer ID de la URL: /ticket/123
const pathParts = window.location.pathname.split('/');
const ticketId = pathParts[pathParts.length - 1];

const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const content = document.getElementById('ticket-content');

// Elementos
const titulo = document.getElementById('ticket-titulo');
const estado = document.getElementById('ticket-estado');
const prioridad = document.getElementById('ticket-prioridad');
const idEl = document.getElementById('ticket-id');
const categoria = document.getElementById('ticket-categoria');
const fecha = document.getElementById('ticket-fecha');
const descripcion = document.getElementById('ticket-descripcion');

const secCodigo = document.getElementById('seccion-codigo');
const lenguaje = document.getElementById('ticket-lenguaje');
const bloqueCodigo = document.getElementById('codigo-bloque');

const selectEstado = document.getElementById('cambiar-estado');
const btnEstado = document.getElementById('btn-estado');
const secResolucion = document.getElementById('seccion-resolucion');
const txtResolucion = document.getElementById('resolucion-texto');
const btnResolucion = document.getElementById('btn-resolucion');

const obsList = document.getElementById('observaciones-list');
const noObs = document.getElementById('no-observaciones');
const formObs = document.getElementById('form-observacion');

function getBadgeEstado(str) {
  const cls = str.toLowerCase().replace(' ', '-');
  return `<span class="badge badge-${cls}">${str}</span>`;
}

function getBadgePrioridad(str) {
  const cls = str.toLowerCase();
  return `<span class="badge badge-${cls}">${str}</span>`;
}

function renderObservaciones(observaciones) {
  if (!observaciones || observaciones.length === 0) {
    noObs.style.display = 'block';
    obsList.innerHTML = '';
    return;
  }
  noObs.style.display = 'none';
  obsList.innerHTML = observaciones.map(obs => `
    <div class="observacion-card">
      <div class="obs-meta">
        <strong>Usuario #${obs.autor_id}</strong>
        <span>${new Date(obs.created_at || Date.now()).toLocaleDateString()}</span>
      </div>
      <div class="obs-content">
        ${obs.contenido}
      </div>
    </div>
  `).join('');
}

async function loadTicket() {
  if (!ticketId) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'No se especificó un ID de ticket.';
    loading.style.display = 'none';
    return;
  }

  try {
    const ticket = await apiGet(`/tickets/${ticketId}`);
    
    // Rellenamos el DOM
    titulo.textContent = ticket.titulo;
    estado.innerHTML = getBadgeEstado(ticket.estado || 'Abierto');
    prioridad.innerHTML = getBadgePrioridad(ticket.prioridad || 'Media');
    idEl.textContent = ticket.id;
    categoria.textContent = ticket.categoria;
    fecha.textContent = new Date(ticket.created_at || Date.now()).toLocaleDateString();
    descripcion.textContent = ticket.descripcion;

    if (ticket.fragmento_codigo) {
      secCodigo.style.display = 'block';
      lenguaje.textContent = ticket.lenguaje_codigo || 'texto';
      bloqueCodigo.className = `language-${ticket.lenguaje_codigo || 'plaintext'}`;
      bloqueCodigo.textContent = ticket.fragmento_codigo;
      // Usar highlight.js (global)
      if (window.hljs) {
        window.hljs.highlightElement(bloqueCodigo);
      }
    }

    selectEstado.value = ticket.estado || 'Abierto';
    if (selectEstado.value === 'Resuelto') {
      secResolucion.style.display = 'block';
      if (ticket.resolucion) txtResolucion.value = ticket.resolucion;
    }

    renderObservaciones(ticket.observaciones || []);

    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (err) {
    console.error(err);
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Error al cargar el detalle del ticket: ' + (err.data?.message || JSON.stringify(err));
    loading.style.display = 'none';
  }
}

// Eventos de estado
selectEstado.addEventListener('change', (e) => {
  if (e.target.value === 'Resuelto') {
    secResolucion.style.display = 'block';
  } else {
    secResolucion.style.display = 'none';
  }
});

btnEstado.addEventListener('click', async () => {
  const nuevoEstado = selectEstado.value;
  try {
    const btnTexto = btnEstado.textContent;
    btnEstado.textContent = '...';
    btnEstado.disabled = true;
    
    const res = await apiPatch(`/tickets/${ticketId}/estado`, { estado: nuevoEstado });
    estado.innerHTML = getBadgeEstado(nuevoEstado);
    alert('Estado actualizado');
  } catch (err) {
    alert('Error al actualizar estado: ' + JSON.stringify(err));
  } finally {
    btnEstado.textContent = 'Actualizar Estado';
    btnEstado.disabled = false;
  }
});

btnResolucion.addEventListener('click', async () => {
  const resolucion = txtResolucion.value.trim();
  if (!resolucion) return alert('Escribe la resolución.');
  try {
    await apiPatch(`/tickets/${ticketId}/resolver`, { resolucion });
    alert('Resolución guardada');
  } catch (err) {
    alert('Error guardando resolución');
  }
});

// Enviar observación
formObs.addEventListener('submit', async (e) => {
  e.preventDefault();
  const txt = document.getElementById('nueva-obs').value.trim();
  if (!txt) return;

  try {
    await apiPost(`/tickets/${ticketId}/observaciones`, { contenido: txt });
    document.getElementById('nueva-obs').value = '';
    // Recargar ticket para ver observación
    loadTicket();
  } catch (err) {
    alert('Error al agregar observación');
  }
});

// Init
loadTicket();

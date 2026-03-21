import { apiGet } from './api.js';

const ticketsBody = document.getElementById('tickets-body');
const filtrosForm = document.getElementById('filtros-form');
const filtroEstado = document.getElementById('filtro-estado');
const filtroPrioridad = document.getElementById('filtro-prioridad');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroMisTickets = document.getElementById('filtro-mis-tickets');
const btnLimpiar = document.getElementById('btn-limpiar');
const errorDiv = document.getElementById('tickets-error');

// Cache de colores de prioridad
const PRIORIDAD_COLORS = { 'Alta': '#ef4444', 'Media': '#f59e0b', 'Baja': '#10b981' };

function getBadgeEstado(estado) {
  if (!estado) return '';
  return `<span class="badge" style="background-color: ${estado.color}">${estado.nombre}</span>`;
}

function getBadgePrioridad(prioridad) {
  if (!prioridad) return '—';
  const color = PRIORIDAD_COLORS[prioridad.nombre] || '#6b7280';
  return `<span class="badge" style="background-color: ${color}">${prioridad.nombre}</span>`;
}

function renderTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    ticketsBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #6b7280; padding: 2rem;">No se encontraron tickets.</td></tr>`;
    return;
  }

  ticketsBody.innerHTML = tickets.map(ticket => {
    const asignadosStr = (ticket.asignados || []).map(a => a.nombre).join(', ') || '—';
    return `
    <tr>
      <td>${ticket.id}</td>
      <td style="font-weight: 500;">${ticket.titulo}</td>
      <td>${ticket.categoria ? ticket.categoria.nombre : '—'}</td>
      <td>${getBadgeEstado(ticket.estado)}</td>
      <td>${getBadgePrioridad(ticket.prioridad)}</td>
      <td>${ticket.creador_nombre || '—'}</td>
      <td>${asignadosStr}</td>
      <td>${new Date(ticket.created_at || Date.now()).toLocaleDateString()}</td>
      <td>
        <a href="/ticket/${ticket.id}" class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.875rem; background: #e5e7eb; color: #1f2937;">Ver</a>
      </td>
    </tr>`;
  }).join('');
}

async function loadTickets() {
  errorDiv.textContent = '';
  const params = {};
  if (filtroEstado.value) params.estado_id = filtroEstado.value;
  if (filtroPrioridad.value) params.prioridad_id = filtroPrioridad.value;
  if (filtroCategoria.value) params.categoria_id = filtroCategoria.value;
  if (filtroMisTickets && filtroMisTickets.checked) params.mis_tickets = 'true';

  try {
    const data = await apiGet('/tickets', params);
    renderTickets(data);
  } catch (err) {
    console.error(err);
    errorDiv.textContent = err.data?.detail || 'Error al cargar los tickets.';
    ticketsBody.innerHTML = '';
  }
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

async function loadOpciones() {
  try {
    const opciones = await apiGet('/tickets/opciones');

    opciones.estados.forEach(e => {
      filtroEstado.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
    });
    opciones.prioridades.forEach(p => {
      filtroPrioridad.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
    });
    opciones.categorias.forEach(c => {
      filtroCategoria.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
  } catch (_) {}
}

waitForRole().then(() => {
  if (window.__userRole !== 'cliente') {
    const container = document.getElementById('filtro-mis-tickets-container');
    if (container) container.style.display = 'flex';
  }
  if (window.__userRole === 'cliente' || window.__userRole === 'senior') {
    const btnNuevo = document.getElementById('btn-nuevo-ticket');
    if (btnNuevo) btnNuevo.style.display = '';
  }
  loadOpciones();
});

loadTickets();

filtrosForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadTickets();
});

if (filtroMisTickets) {
  filtroMisTickets.addEventListener('change', loadTickets);
}

btnLimpiar.addEventListener('click', () => {
  filtroEstado.value = '';
  filtroPrioridad.value = '';
  filtroCategoria.value = '';
  if (filtroMisTickets) filtroMisTickets.checked = false;
  loadTickets();
});

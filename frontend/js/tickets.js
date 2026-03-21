import { apiGet } from './api.js';
import { showToast } from './toast.js';

const ticketsBody = document.getElementById('tickets-body');
const filtrosForm = document.getElementById('filtros-form');
const filtroEstado = document.getElementById('filtro-estado');
const filtroPrioridad = document.getElementById('filtro-prioridad');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroMisTickets = document.getElementById('filtro-mis-tickets');
const btnLimpiar = document.getElementById('btn-limpiar');
const errorDiv = document.getElementById('tickets-error');

function normalizeBadge(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');
}

function getBadgeEstado(estado) {
  if (!estado) return '';
  return `<span class="badge badge--${normalizeBadge(estado.nombre)}">${estado.nombre}</span>`;
}

function getBadgePrioridad(prioridad) {
  if (!prioridad) return '—';
  return `<span class="badge badge--${normalizeBadge(prioridad.nombre)}">${prioridad.nombre}</span>`;
}

function renderTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    ticketsBody.innerHTML = `<tr><td colspan="9">
      <div class="empty-state">
        <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="9" y1="16" x2="13" y2="16"/>
        </svg>
        <p class="empty-state__text">No se encontraron tickets.</p>
      </div>
    </td></tr>`;
    return;
  }

  ticketsBody.classList.add('animate-rows');
  ticketsBody.innerHTML = tickets.map(ticket => {
    const asignadosStr = (ticket.asignados || []).map(a => a.nombre).join(', ') || '—';
    return `
    <tr>
      <td>${ticket.id}</td>
      <td class="col-title">${ticket.titulo}</td>
      <td>${ticket.categoria ? ticket.categoria.nombre : '—'}</td>
      <td>${getBadgeEstado(ticket.estado)}</td>
      <td>${getBadgePrioridad(ticket.prioridad)}</td>
      <td>${ticket.creador_nombre || '—'}</td>
      <td>${asignadosStr}</td>
      <td>${new Date(ticket.created_at || Date.now()).toLocaleDateString()}</td>
      <td>
        <a href="/ticket/${ticket.id}" class="btn btn-action">Ver</a>
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
    showToast(err.data?.detail || 'Error al cargar los tickets.', 'error');
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
    if (container) container.hidden = false;
  }
  if (window.__userRole === 'cliente' || window.__userRole === 'senior') {
    const btnNuevo = document.getElementById('btn-nuevo-ticket');
    if (btnNuevo) btnNuevo.hidden = false;
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

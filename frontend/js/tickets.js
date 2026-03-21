import { apiGet } from './api.js';

const ticketsBody = document.getElementById('tickets-body');
const filtrosForm = document.getElementById('filtros-form');
const filtroEstado = document.getElementById('filtro-estado');
const filtroPrioridad = document.getElementById('filtro-prioridad');
const filtroCategoria = document.getElementById('filtro-categoria');
const btnLimpiar = document.getElementById('btn-limpiar');
const errorDiv = document.getElementById('tickets-error');

function getBadgeEstado(estado) {
  const cls = estado.toLowerCase().replace(' ', '-');
  return `<span class="badge badge-${cls}">${estado}</span>`;
}

function getBadgePrioridad(prioridad) {
  const cls = prioridad.toLowerCase();
  return `<span class="badge badge-${cls}">${prioridad}</span>`;
}

function renderTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    ticketsBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #6b7280; padding: 2rem;">No se encontraron tickets.</td></tr>`;
    return;
  }

  ticketsBody.innerHTML = tickets.map(ticket => `
    <tr>
      <td>${ticket.id}</td>
      <td style="font-weight: 500;">${ticket.titulo}</td>
      <td>${ticket.categoria}</td>
      <td>${getBadgeEstado(ticket.estado || 'Abierto')}</td>
      <td>${getBadgePrioridad(ticket.prioridad || 'Media')}</td>
      <td>${new Date(ticket.created_at || Date.now()).toLocaleDateString()}</td>
      <td>
        <a href="/ticket/${ticket.id}" class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.875rem; background: #e5e7eb; color: #1f2937;">Ver Detalle</a>
      </td>
    </tr>
  `).join('');
}

async function loadTickets() {
  errorDiv.textContent = '';
  const params = {};
  if (filtroEstado.value) params.estado = filtroEstado.value;
  if (filtroPrioridad.value) params.prioridad = filtroPrioridad.value;
  if (filtroCategoria.value) params.categoria = filtroCategoria.value;

  try {
    const data = await apiGet('/tickets', params);
    const list = data;
    renderTickets(list);
  } catch (err) {
    console.error(err);
    errorDiv.textContent = err.data?.message || err.data || 'Error al cargar los tickets. Verifica tu conexión o inicia sesión.';
    ticketsBody.innerHTML = '';
  }
}

// Inicializar
loadTickets();

// Filtrar
filtrosForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadTickets();
});

// Limpiar filtros
btnLimpiar.addEventListener('click', () => {
  filtroEstado.value = '';
  filtroPrioridad.value = '';
  filtroCategoria.value = '';
  loadTickets();
});

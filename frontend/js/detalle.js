import { apiGet, apiPatch, apiPost, apiDelete, apiPut } from './api.js';
import { showToast } from './toast.js';

const pathParts = window.location.pathname.split('/');
const ticketId = pathParts[pathParts.length - 1];

const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const content = document.getElementById('ticket-content');

const titulo = document.getElementById('ticket-titulo');
const estado = document.getElementById('ticket-estado');
const prioridad = document.getElementById('ticket-prioridad');
const idEl = document.getElementById('ticket-id');
const categoria = document.getElementById('ticket-categoria');
const fecha = document.getElementById('ticket-fecha');
const descripcion = document.getElementById('ticket-descripcion');
const creadorEl = document.getElementById('ticket-creador');

const secCodigo = document.getElementById('seccion-codigo');
const lenguaje = document.getElementById('ticket-lenguaje');
const bloqueCodigo = document.getElementById('codigo-bloque');

const selectEstado = document.getElementById('cambiar-estado');
const secResolucion = document.getElementById('seccion-resolucion');
const txtResolucion = document.getElementById('resolucion-texto');

const obsList = document.getElementById('observaciones-list');
const noObs = document.getElementById('no-observaciones');
const formObs = document.getElementById('form-observacion');

const asignadosEl = document.getElementById('asignados-list');
const secAsignacion = document.getElementById('seccion-asignacion');
const historialEl = document.getElementById('historial-asignaciones');
const historialAsignacionesContainer = document.getElementById('historial-asignaciones-container');
const historialEstadosEl = document.getElementById('historial-estados');

const secRechazo = document.getElementById('seccion-rechazo');
const motivoRechazoTexto = document.getElementById('motivo-rechazo-texto');
const secCancelar = document.getElementById('seccion-cancelar');
const btnCancelar = document.getElementById('btn-cancelar-ticket');
const secMotivoInput = document.getElementById('seccion-motivo-input');
const motivoRechazoInput = document.getElementById('motivo-rechazo-input');
const secClasificacion = document.getElementById('seccion-clasificacion');
const editarCategoria = document.getElementById('editar-categoria');
const editarPrioridad = document.getElementById('editar-prioridad');

// Mapa nombre → id de estados (se carga desde la API)
let estadosMap = {};

function showSection(el) {
  if (!el) return;
  el.hidden = false;
  el.classList.add('is-visible');
}

function hideSection(el) {
  if (!el) return;
  el.hidden = true;
  el.classList.remove('is-visible');
}

function estadoOpt(nombre) {
  return `<option value="${estadosMap[nombre] || ''}">${nombre}</option>`;
}

function getSelectedEstadoText() {
  return selectEstado.options[selectEstado.selectedIndex]?.text || '';
}

function normalizeBadge(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');
}

function getBadgeEstado(est) {
  if (!est) return '';
  return `<span class="badge badge--${normalizeBadge(est.nombre)}">${est.nombre}</span>`;
}

function getBadgePrioridad(pri) {
  if (!pri) return '';
  return `<span class="badge badge--${normalizeBadge(pri.nombre)}">${pri.nombre}</span>`;
}

function renderObservaciones(observaciones) {
  if (!observaciones || observaciones.length === 0) {
    noObs.hidden = false;
    obsList.innerHTML = '';
    return;
  }
  noObs.hidden = true;
  obsList.innerHTML = observaciones.map(obs => `
    <div class="observacion-card">
      <div class="obs-meta">
        <strong>${obs.autor_nombre ? obs.autor_nombre + '#' + obs.autor_id : 'Usuario#' + obs.autor_id}</strong>
        <span>${new Date(obs.created_at || Date.now()).toLocaleDateString()}</span>
      </div>
      <div class="obs-content">${obs.contenido}</div>
    </div>
  `).join('');
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

async function loadTicket() {
  if (!ticketId) {
    errorDiv.hidden = false;
    errorDiv.textContent = 'No se especifico un ID de ticket.';
    loading.hidden = true;
    return;
  }

  await waitForRole();
  const userRole = window.__userRole;
  const userId = window.__userId;

  try {
    // Cargar mapa de estados (nombre → id)
    const opciones = await apiGet('/tickets/opciones');
    estadosMap = {};
    opciones.estados.forEach(e => { estadosMap[e.nombre] = e.id; });

    const ticket = await apiGet(`/tickets/${ticketId}`);
    const estadoNombre = ticket.estado ? ticket.estado.nombre : 'Pendiente';

    // Breadcrumb
    const breadcrumbTxt = document.getElementById('breadcrumb-text');
    if (breadcrumbTxt) breadcrumbTxt.textContent = `Ticket #${ticket.id}`;

    // Info basica
    titulo.textContent = ticket.titulo;
    estado.innerHTML = getBadgeEstado(ticket.estado);
    prioridad.innerHTML = getBadgePrioridad(ticket.prioridad);
    idEl.textContent = ticket.id;
    categoria.textContent = ticket.categoria ? ticket.categoria.nombre : 'Sin clasificar';
    fecha.textContent = new Date(ticket.created_at || Date.now()).toLocaleDateString();
    if (creadorEl) creadorEl.textContent = ticket.creador_nombre || '—';
    descripcion.textContent = ticket.descripcion;

    // Asignados
    if (asignadosEl) {
      const nombres = (ticket.asignados || []).map(a => a.nombre).join(', ');
      asignadosEl.textContent = nombres || 'Sin asignar';
    }

    // Motivo de rechazo
    if (estadoNombre === 'Rechazado') {
      showSection(secRechazo);
      if (motivoRechazoTexto) motivoRechazoTexto.textContent = ticket.motivo_rechazo || '';
    }

    // Boton cancelar
    if (userRole === 'cliente' && estadoNombre === 'Pendiente' && ticket.creado_por === userId) {
      showSection(secCancelar);
    }

    // Codigo
    if (ticket.fragmento_codigo) {
      showSection(secCodigo);
      lenguaje.textContent = ticket.lenguaje_codigo || 'texto';
      bloqueCodigo.className = `language-${ticket.lenguaje_codigo || 'plaintext'}`;
      bloqueCodigo.textContent = ticket.fragmento_codigo;
      if (window.hljs) window.hljs.highlightElement(bloqueCodigo);
    }

    // Resolucion (lectura)
    if (userRole === 'cliente' && estadoNombre === 'Resuelto') {
      const validDiv = document.createElement('div');
      validDiv.className = 'alert-section alert-section--warning';
      validDiv.innerHTML = `<h4 class="alert-title">En validación</h4><p class="alert-body">Tu ticket ha sido resuelto y se encuentra en proceso de validación por el equipo de soporte.</p>`;
      const descContainer = descripcion.parentElement;
      descContainer.parentElement.insertBefore(validDiv, descContainer.nextSibling);
    } else if (userRole === 'cliente' && estadoNombre === 'Cerrado' && ticket.resolucion) {
      const resDiv = document.createElement('div');
      resDiv.className = 'alert-section alert-section--success';
      resDiv.innerHTML = `<h4 class="alert-title">Resolución</h4><p class="alert-body">${ticket.resolucion}</p>`;
      const descContainer = descripcion.parentElement;
      descContainer.parentElement.insertBefore(resDiv, descContainer.nextSibling);
    } else if (userRole !== 'cliente' && (estadoNombre === 'Resuelto' || estadoNombre === 'Cerrado') && ticket.resolucion) {
      showSection(secResolucion);
      txtResolucion.value = ticket.resolucion;
      txtResolucion.disabled = true;
    }

    // Guardar original para comparar
    window.__ticketOriginal = {
      estado: estadoNombre,
      estado_id: ticket.estado ? ticket.estado.id : null,
      categoria_id: ticket.categoria ? ticket.categoria.id : null,
      prioridad_id: ticket.prioridad ? ticket.prioridad.id : null,
      asignadoIds: (ticket.asignados || []).map(a => a.id).sort().join(','),
    };

    // --- Controles de estado segun rol ---
    const isAsignado = (ticket.asignados || []).some(a => a.id === userId);
    selectEstado.innerHTML = '';

    const gestionEstado = document.querySelector('.gestion-estado-container');
    const responsablesContainer = document.getElementById('seccion-responsables-container');

    const estadoTooltip = document.getElementById('estado-tooltip');

    if (userRole === 'cliente') {
      hideSection(gestionEstado);
      hideSection(responsablesContainer);
    } else if (userRole === 'senior') {
      // Estado select
      if (estadoNombre === 'Pendiente') {
        const tieneAsignados = (ticket.asignados || []).length > 0;
        if (tieneAsignados) {
          selectEstado.innerHTML = estadoOpt('Pendiente') + estadoOpt('Abierto') + estadoOpt('Rechazado');
          if (estadoTooltip) estadoTooltip.setAttribute('hidden', '');
        } else {
          selectEstado.innerHTML = estadoOpt('Pendiente') + estadoOpt('Rechazado');
          if (estadoTooltip) {
            estadoTooltip.textContent = 'Asigna al menos un responsable para poder pasar a Abierto';
            estadoTooltip.removeAttribute('hidden');
          }
        }
      } else if (estadoNombre === 'Abierto') {
        selectEstado.innerHTML = estadoOpt('Abierto') + estadoOpt('En revisión');
      } else if (estadoNombre === 'En revisión') {
        selectEstado.innerHTML = estadoOpt('En revisión') + estadoOpt('En proceso');
      } else if (estadoNombre === 'En proceso') {
        selectEstado.innerHTML = estadoOpt('En proceso') + estadoOpt('Resuelto') + estadoOpt('En revisión');
      } else if (estadoNombre === 'Resuelto') {
        selectEstado.innerHTML = estadoOpt('Resuelto') + estadoOpt('Cerrado') + estadoOpt('En proceso');
      } else {
        selectEstado.innerHTML = estadoOpt(estadoNombre);
        selectEstado.disabled = true;
      }

      // Clasificacion y responsables: ocultar si Cerrado o Rechazado
      const esTerminal = estadoNombre === 'Cerrado' || estadoNombre === 'Rechazado';

      if (esTerminal) {
        // Mostrar todo en modo lectura
        showSection(secClasificacion);
        await loadOpcionesClasificacion(ticket);
        if (editarCategoria) editarCategoria.disabled = true;
        if (editarPrioridad) editarPrioridad.disabled = true;
        if (secResolucion && ticket.resolucion) {
          showSection(secResolucion);
          txtResolucion.value = ticket.resolucion;
          txtResolucion.disabled = true;
        }
        // Ocultar botón guardar y responsables
        const btnGuardar = document.getElementById('btn-guardar-gestion');
        if (btnGuardar) btnGuardar.style.display = 'none';
        hideSection(responsablesContainer);
      } else {
        showSection(secClasificacion);
        await loadOpcionesClasificacion(ticket);
        showSection(responsablesContainer);
        await loadAsignacionUI(ticket.asignados || []);
      }
    } else if (userRole === 'developer' && isAsignado) {
      hideSection(responsablesContainer);
      if (estadoNombre === 'Abierto') {
        selectEstado.innerHTML = estadoOpt('Abierto') + estadoOpt('En revisión');
      } else if (estadoNombre === 'En revisión') {
        selectEstado.innerHTML = estadoOpt('En revisión') + estadoOpt('En proceso');
      } else if (estadoNombre === 'En proceso') {
        selectEstado.innerHTML = estadoOpt('En proceso') + estadoOpt('Resuelto') + estadoOpt('En revisión');
      } else {
        selectEstado.innerHTML = estadoOpt(estadoNombre);
        selectEstado.disabled = true;
      }
    } else {
      selectEstado.innerHTML = estadoOpt(estadoNombre);
      selectEstado.disabled = true;
      hideSection(responsablesContainer);
    }

    // Ocultar form observacion si cerrado/rechazado
    if (estadoNombre === 'Cerrado' || estadoNombre === 'Rechazado') {
      hideSection(formObs);
    }

    // Historial de estados (todos los roles)
    if (historialEstadosEl) {
      await loadHistorialEstados(userRole);
    }

    // Historial de asignaciones (solo senior y developer)
    if (historialEl && userRole !== 'cliente') {
      await loadHistorial();
    } else {
      hideSection(historialAsignacionesContainer);
    }

    // Observaciones (solo senior y developer)
    if (userRole !== 'cliente') {
      try {
        const observaciones = await apiGet(`/tickets/${ticketId}/observaciones`);
        renderObservaciones(observaciones);
      } catch (_) {
        renderObservaciones([]);
      }
    } else {
      hideSection(obsList.parentElement);
    }

    loading.hidden = true;
    content.hidden = false;
  } catch (err) {
    console.error(err);
    errorDiv.hidden = false;
    errorDiv.textContent = 'Error al cargar el ticket: ' + (err.data?.detail || JSON.stringify(err));
    loading.hidden = true;
  }
}

async function loadOpcionesClasificacion(ticket) {
  try {
    const opciones = await apiGet('/tickets/opciones');
    editarCategoria.innerHTML = '<option value="">Selecciona...</option>';
    editarPrioridad.innerHTML = '<option value="">Selecciona...</option>';
    opciones.categorias.forEach(c => {
      const selected = ticket.categoria && ticket.categoria.id === c.id ? 'selected' : '';
      editarCategoria.innerHTML += `<option value="${c.id}" ${selected}>${c.nombre}</option>`;
    });
    opciones.prioridades.forEach(p => {
      const selected = ticket.prioridad && ticket.prioridad.id === p.id ? 'selected' : '';
      editarPrioridad.innerHTML += `<option value="${p.id}" ${selected}>${p.nombre}</option>`;
    });
  } catch (_) {}
}

async function loadAsignacionUI(currentAsignados) {
  const container = document.getElementById('asignacion-checkboxes');
  if (!container) return;
  try {
    const todosUsuarios = await apiGet('/usuarios');
    const usuarios = todosUsuarios.filter(u => u.rol !== 'cliente');
    const asignadoIds = currentAsignados.map(a => a.id);
    container.innerHTML = usuarios.map(u => `
      <label class="checkbox-label">
        <input type="checkbox" class="asignado-check" value="${u.id}" ${asignadoIds.includes(u.id) ? 'checked' : ''}>
        ${u.nombre} <span class="role-hint">(${u.rol})</span>
      </label>
    `).join('');
  } catch (_) {
    container.innerHTML = '<p class="text-muted">Error al cargar usuarios</p>';
  }
}

async function loadHistorialEstados(userRole) {
  if (!historialEstadosEl) return;
  try {
    const historial = await apiGet(`/tickets/${ticketId}/historial-estados`);
    if (historial.length === 0) {
      historialEstadosEl.innerHTML = '<p class="text-muted">Sin historial.</p>';
      return;
    }
    historialEstadosEl.innerHTML = historial.map(h => {
      const badge = `<span class="badge badge--${normalizeBadge(h.estado.nombre)}">${h.estado.nombre}</span>`;
      const ejecutor = (userRole !== 'cliente' && h.cambiado_por_nombre) ? ` — ${h.cambiado_por_nombre}` : '';
      return `
        <div class="history-entry">
          <span class="history-date">${new Date(h.created_at).toLocaleDateString()}</span>
          ${badge}${ejecutor}
        </div>`;
    }).join('');
  } catch (_) {
    historialEstadosEl.innerHTML = '';
  }
}

async function loadHistorial() {
  if (!historialEl) return;
  try {
    const historial = await apiGet(`/tickets/${ticketId}/historial-asignaciones`);
    if (historial.length === 0) {
      historialEl.innerHTML = '<p class="text-muted">Sin historial.</p>';
      return;
    }
    historialEl.innerHTML = historial.map(h => `
      <div class="history-entry">
        <span class="history-date">${new Date(h.created_at).toLocaleDateString()}</span>
        <span>${h.usuario_nombres.join(', ') || 'Sin asignar'}</span>
      </div>
    `).join('');
  } catch (_) {
    historialEl.innerHTML = '';
  }
}

// --- Eventos ---

selectEstado.addEventListener('change', () => {
  const nombre = getSelectedEstadoText();
  if (nombre === 'Resuelto') {
    showSection(secResolucion);
    txtResolucion.disabled = false;
  } else {
    hideSection(secResolucion);
  }
  if (nombre === 'Rechazado') {
    showSection(secMotivoInput);
  } else {
    hideSection(secMotivoInput);
  }
});

// Boton "Guardar" — gestion del ticket
const btnGuardar = document.getElementById('btn-guardar-gestion');
if (btnGuardar) {
  btnGuardar.addEventListener('click', async () => {
    btnGuardar.textContent = 'Guardando...';
    btnGuardar.disabled = true;
    const orig = window.__ticketOriginal || {};

    try {
      let cambios = false;

      // 1. Clasificacion (solo si cambio)
      if (editarCategoria && editarCategoria.offsetParent !== null) {
        const catId = editarCategoria.value ? parseInt(editarCategoria.value) : null;
        const priId = editarPrioridad.value ? parseInt(editarPrioridad.value) : null;
        const updateBody = {};
        if (catId !== orig.categoria_id) updateBody.categoria_id = catId;
        if (priId !== orig.prioridad_id) updateBody.prioridad_id = priId;
        if (Object.keys(updateBody).length > 0) {
          await apiPatch(`/tickets/${ticketId}`, updateBody);
          cambios = true;
        }
      }

      // 2. Estado
      const nuevoEstadoId = parseInt(selectEstado.value);
      const nuevoEstadoNombre = getSelectedEstadoText();
      const body = { estado_id: nuevoEstadoId };

      if (nuevoEstadoNombre === 'Resuelto') {
        const resolucion = txtResolucion.value.trim();
        if (resolucion) body.resolucion = resolucion;
      }

      if (nuevoEstadoNombre === 'Rechazado') {
        const motivo = motivoRechazoInput ? motivoRechazoInput.value.trim() : '';
        if (!motivo) {
          showToast('El motivo de rechazo es obligatorio', 'warning');
          btnGuardar.textContent = 'Guardar';
          btnGuardar.disabled = false;
          return;
        }
        body.motivo_rechazo = motivo;
      }

      if (nuevoEstadoNombre !== orig.estado) {
        await apiPatch(`/tickets/${ticketId}/estado`, body);
        cambios = true;
      }

      if (cambios) {
        showToast('Cambios guardados', 'success');
      } else {
        showToast('Sin cambios', 'info');
      }
      loadTicket();
    } catch (err) {
      showToast(err.data?.detail || 'Error al guardar', 'error');
    } finally {
      btnGuardar.textContent = 'Guardar';
      btnGuardar.disabled = false;
    }
  });
}

// Boton "Guardar Responsables"
const btnGuardarResp = document.getElementById('btn-guardar-responsables');
if (btnGuardarResp) {
  btnGuardarResp.addEventListener('click', async () => {
    btnGuardarResp.textContent = 'Guardando...';
    btnGuardarResp.disabled = true;
    const orig = window.__ticketOriginal || {};

    try {
      const asignadoIds = Array.from(document.querySelectorAll('.asignado-check:checked'))
        .map(c => parseInt(c.value)).sort();
      const nuevosIds = asignadoIds.join(',');

      if (nuevosIds === orig.asignadoIds) {
        showToast('Sin cambios en responsables', 'info');
        loadTicket();
        return;
      }

      await apiPut(`/tickets/${ticketId}/asignados`, { usuario_ids: asignadoIds });

      // Auto-transicion: Pendiente -> Abierto si cat + pri + asignados
      if (orig.estado === 'Pendiente' && asignadoIds.length > 0) {
        const catId = editarCategoria ? editarCategoria.value : null;
        const priId = editarPrioridad ? editarPrioridad.value : null;
        if (catId && priId) {
          // Guardar clasificacion si cambio
          const updateBody = {};
          const catInt = parseInt(catId);
          const priInt = parseInt(priId);
          if (catInt !== orig.categoria_id) updateBody.categoria_id = catInt;
          if (priInt !== orig.prioridad_id) updateBody.prioridad_id = priInt;
          if (Object.keys(updateBody).length > 0) {
            await apiPatch(`/tickets/${ticketId}`, updateBody);
          }
          await apiPatch(`/tickets/${ticketId}/estado`, { estado_id: estadosMap['Abierto'] });
        }
      }

      showToast('Responsables actualizados', 'success');
      loadTicket();
    } catch (err) {
      showToast(err.data?.detail || 'Error al guardar responsables', 'error');
    } finally {
      btnGuardarResp.textContent = 'Guardar Responsables';
      btnGuardarResp.disabled = false;
    }
  });
}

// Cancelar ticket
if (btnCancelar) {
  btnCancelar.addEventListener('click', async () => {
    if (!confirm('Estas seguro de cancelar este ticket?')) return;
    try {
      await apiDelete(`/tickets/${ticketId}`);
      showToast('Ticket cancelado', 'success');
      window.location.href = '/tickets';
    } catch (err) {
      showToast(err.data?.detail || 'Error al cancelar', 'error');
    }
  });
}

// Observacion
formObs.addEventListener('submit', async (e) => {
  e.preventDefault();
  const txt = document.getElementById('nueva-obs').value.trim();
  if (!txt) return;
  try {
    await apiPost(`/tickets/${ticketId}/observaciones`, { contenido: txt });
    document.getElementById('nueva-obs').value = '';
    loadTicket();
  } catch (err) {
    showToast(err.data?.detail || 'Error al agregar observacion', 'error');
  }
});

loadTicket();

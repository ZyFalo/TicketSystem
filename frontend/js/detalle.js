import { apiGet, apiPatch, apiPost, apiDelete } from './api.js';

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

const PRIORIDAD_COLORS = { 'Alta': '#ef4444', 'Media': '#f59e0b', 'Baja': '#10b981' };

function getBadgeEstado(est) {
  if (!est) return '';
  return `<span class="badge" style="background-color: ${est.color}">${est.nombre}</span>`;
}

function getBadgePrioridad(pri) {
  if (!pri) return '';
  const color = PRIORIDAD_COLORS[pri.nombre] || '#6b7280';
  return `<span class="badge" style="background-color: ${color}">${pri.nombre}</span>`;
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
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'No se especificó un ID de ticket.';
    loading.style.display = 'none';
    return;
  }

  await waitForRole();
  const userRole = window.__userRole;
  const userId = window.__userId;

  try {
    const ticket = await apiGet(`/tickets/${ticketId}`);
    const estadoNombre = ticket.estado ? ticket.estado.nombre : 'Pendiente';

    // Info básica
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
    if (estadoNombre === 'Rechazado' && secRechazo) {
      secRechazo.style.display = '';
      if (motivoRechazoTexto) motivoRechazoTexto.textContent = ticket.motivo_rechazo || '';
    }

    // Botón cancelar
    if (userRole === 'cliente' && estadoNombre === 'Pendiente' && ticket.creado_por === userId && secCancelar) {
      secCancelar.style.display = '';
    }

    // Código
    if (ticket.fragmento_codigo) {
      secCodigo.style.display = 'block';
      lenguaje.textContent = ticket.lenguaje_codigo || 'texto';
      bloqueCodigo.className = `language-${ticket.lenguaje_codigo || 'plaintext'}`;
      bloqueCodigo.textContent = ticket.fragmento_codigo;
      if (window.hljs) window.hljs.highlightElement(bloqueCodigo);
    }

    // Resolución (lectura)
    if ((estadoNombre === 'Resuelto' || estadoNombre === 'Cerrado') && ticket.resolucion) {
      if (userRole === 'cliente') {
        const resDiv = document.createElement('div');
        resDiv.style.cssText = 'background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;';
        resDiv.innerHTML = `<h4 style="color: #16a34a; margin: 0 0 0.5rem;">Resolución</h4><p style="color: #374151; white-space: pre-wrap;">${ticket.resolucion}</p>`;
        const descContainer = descripcion.parentElement;
        descContainer.parentElement.insertBefore(resDiv, descContainer.nextSibling);
      } else {
        secResolucion.style.display = 'block';
        txtResolucion.value = ticket.resolucion;
        txtResolucion.disabled = true;
      }
    }

    // Guardar original para comparar
    window.__ticketOriginal = {
      estado: estadoNombre,
      categoria_id: ticket.categoria ? ticket.categoria.id : null,
      prioridad_id: ticket.prioridad ? ticket.prioridad.id : null,
      asignadoIds: (ticket.asignados || []).map(a => a.id).sort().join(','),
    };

    // --- Controles de estado según rol ---
    const isAsignado = (ticket.asignados || []).some(a => a.id === userId);
    selectEstado.innerHTML = '';

    const gestionEstado = document.querySelector('.gestion-estado-container');
    const responsablesContainer = document.getElementById('seccion-responsables-container');

    const estadoTooltip = document.getElementById('estado-tooltip');

    if (userRole === 'cliente') {
      if (gestionEstado) gestionEstado.style.display = 'none';
      if (responsablesContainer) responsablesContainer.style.display = 'none';
    } else if (userRole === 'senior') {
      // Estado select
      if (estadoNombre === 'Pendiente') {
        const tieneAsignados = (ticket.asignados || []).length > 0;
        if (tieneAsignados) {
          selectEstado.innerHTML = '<option value="Pendiente">Pendiente</option><option value="Abierto">Abierto</option><option value="Rechazado">Rechazado</option>';
          if (estadoTooltip) estadoTooltip.style.display = 'none';
        } else {
          selectEstado.innerHTML = '<option value="Pendiente">Pendiente</option><option value="Rechazado">Rechazado</option>';
          if (estadoTooltip) {
            estadoTooltip.textContent = 'Asigna al menos un responsable para poder pasar a Abierto';
            estadoTooltip.style.display = '';
          }
        }
      } else if (estadoNombre === 'Abierto') {
        selectEstado.innerHTML = '<option value="Abierto">Abierto</option><option value="En revisión">En revisión</option>';
      } else if (estadoNombre === 'En revisión') {
        selectEstado.innerHTML = '<option value="En revisión">En revisión</option><option value="En proceso">En proceso</option>';
      } else if (estadoNombre === 'En proceso') {
        selectEstado.innerHTML = '<option value="En proceso">En proceso</option><option value="Resuelto">Resuelto</option><option value="En revisión">En revisión</option>';
      } else if (estadoNombre === 'Resuelto') {
        selectEstado.innerHTML = '<option value="Resuelto">Resuelto</option><option value="Cerrado">Cerrado</option><option value="En proceso">En proceso</option>';
      } else {
        selectEstado.innerHTML = `<option value="${estadoNombre}">${estadoNombre}</option>`;
        selectEstado.disabled = true;
      }

      // Clasificación y responsables: ocultar si Cerrado o Rechazado
      const esTerminal = estadoNombre === 'Cerrado' || estadoNombre === 'Rechazado';

      if (secClasificacion && !esTerminal) {
        secClasificacion.style.display = '';
        await loadOpcionesClasificacion(ticket);
      }

      if (responsablesContainer && !esTerminal) {
        responsablesContainer.style.display = '';
        await loadAsignacionUI(ticket.asignados || []);
      }
    } else if (userRole === 'developer' && isAsignado) {
      if (responsablesContainer) responsablesContainer.style.display = 'none';
      if (estadoNombre === 'Abierto') {
        selectEstado.innerHTML = '<option value="Abierto">Abierto</option><option value="En revisión">En revisión</option>';
      } else if (estadoNombre === 'En revisión') {
        selectEstado.innerHTML = '<option value="En revisión">En revisión</option><option value="En proceso">En proceso</option>';
      } else if (estadoNombre === 'En proceso') {
        selectEstado.innerHTML = '<option value="En proceso">En proceso</option><option value="Resuelto">Resuelto</option><option value="En revisión">En revisión</option>';
      } else {
        selectEstado.innerHTML = `<option value="${estadoNombre}">${estadoNombre}</option>`;
        selectEstado.disabled = true;
      }
    } else {
      selectEstado.innerHTML = `<option value="${estadoNombre}">${estadoNombre}</option>`;
      selectEstado.disabled = true;
      if (responsablesContainer) responsablesContainer.style.display = 'none';
    }

    // Ocultar form observación si cerrado/rechazado
    if (estadoNombre === 'Cerrado' || estadoNombre === 'Rechazado') {
      formObs.style.display = 'none';
    }

    // Historial de estados (todos los roles)
    if (historialEstadosEl) {
      await loadHistorialEstados(userRole);
    }

    // Historial de asignaciones (solo senior y developer)
    if (historialEl && userRole !== 'cliente') {
      await loadHistorial();
    } else if (historialAsignacionesContainer) {
      historialAsignacionesContainer.style.display = 'none';
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
      obsList.parentElement.style.display = 'none';
    }

    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (err) {
    console.error(err);
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Error al cargar el ticket: ' + (err.data?.detail || JSON.stringify(err));
    loading.style.display = 'none';
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
      <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0;">
        <input type="checkbox" class="asignado-check" value="${u.id}" ${asignadoIds.includes(u.id) ? 'checked' : ''}>
        ${u.nombre} <span style="color: #6b7280; font-size: 0.75rem;">(${u.rol})</span>
      </label>
    `).join('');
  } catch (_) {
    container.innerHTML = '<p style="color: #6b7280;">Error al cargar usuarios</p>';
  }
}

async function loadHistorialEstados(userRole) {
  if (!historialEstadosEl) return;
  try {
    const historial = await apiGet(`/tickets/${ticketId}/historial-estados`);
    if (historial.length === 0) {
      historialEstadosEl.innerHTML = '<p style="color: #6b7280; font-size: 0.875rem;">Sin historial.</p>';
      return;
    }
    historialEstadosEl.innerHTML = historial.map(h => {
      const badge = `<span class="badge" style="background-color: ${h.estado.color}; font-size: 0.7rem;">${h.estado.nombre}</span>`;
      const ejecutor = (userRole !== 'cliente' && h.cambiado_por_nombre) ? ` — ${h.cambiado_por_nombre}` : '';
      return `
        <div style="display: flex; gap: 0.75rem; padding: 0.25rem 0; font-size: 0.875rem; align-items: center;">
          <span style="color: #6b7280; min-width: 80px;">${new Date(h.created_at).toLocaleDateString()}</span>
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
      historialEl.innerHTML = '<p style="color: #6b7280; font-size: 0.875rem;">Sin historial.</p>';
      return;
    }
    historialEl.innerHTML = historial.map(h => `
      <div style="display: flex; gap: 1rem; padding: 0.25rem 0; font-size: 0.875rem;">
        <span style="color: #6b7280; min-width: 80px;">${new Date(h.created_at).toLocaleDateString()}</span>
        <span>${h.usuario_nombres.join(', ') || 'Sin asignar'}</span>
      </div>
    `).join('');
  } catch (_) {
    historialEl.innerHTML = '';
  }
}

// --- Eventos ---

selectEstado.addEventListener('change', (e) => {
  if (e.target.value === 'Resuelto') {
    secResolucion.style.display = '';
    txtResolucion.disabled = false;
  } else {
    secResolucion.style.display = 'none';
  }
  if (e.target.value === 'Rechazado') {
    if (secMotivoInput) secMotivoInput.style.display = '';
  } else {
    if (secMotivoInput) secMotivoInput.style.display = 'none';
  }
});

// Botón "Guardar" — gestión del ticket
const btnGuardar = document.getElementById('btn-guardar-gestion');
if (btnGuardar) {
  btnGuardar.addEventListener('click', async () => {
    btnGuardar.textContent = 'Guardando...';
    btnGuardar.disabled = true;
    const orig = window.__ticketOriginal || {};

    try {
      let cambios = false;

      // 1. Clasificación (solo si cambió)
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
      const nuevoEstado = selectEstado.value;
      const body = { estado: nuevoEstado };

      if (nuevoEstado === 'Resuelto') {
        const resolucion = txtResolucion.value.trim();
        if (resolucion) body.resolucion = resolucion;
      }

      if (nuevoEstado === 'Rechazado') {
        const motivo = motivoRechazoInput ? motivoRechazoInput.value.trim() : '';
        if (!motivo) {
          alert('El motivo de rechazo es obligatorio.');
          btnGuardar.textContent = 'Guardar';
          btnGuardar.disabled = false;
          return;
        }
        body.motivo_rechazo = motivo;
      }

      if (nuevoEstado !== orig.estado) {
        await apiPatch(`/tickets/${ticketId}/estado`, body);
        cambios = true;
      }

      if (cambios) {
        alert('Cambios guardados');
      } else {
        alert('Sin cambios que guardar');
      }
      loadTicket();
    } catch (err) {
      alert(err.data?.detail || 'Error al guardar');
    } finally {
      btnGuardar.textContent = 'Guardar';
      btnGuardar.disabled = false;
    }
  });
}

// Botón "Guardar Responsables"
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
        alert('Sin cambios en responsables');
        loadTicket();
        return;
      }

      const resp = await fetch(`/api/tickets/${ticketId}/asignados`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_ids: asignadoIds }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw { data: err };
      }

      // Auto-transición: Pendiente → Abierto si cat + pri + asignados
      if (orig.estado === 'Pendiente' && asignadoIds.length > 0) {
        const catId = editarCategoria ? editarCategoria.value : null;
        const priId = editarPrioridad ? editarPrioridad.value : null;
        if (catId && priId) {
          // Guardar clasificación si cambió
          const updateBody = {};
          const catInt = parseInt(catId);
          const priInt = parseInt(priId);
          if (catInt !== orig.categoria_id) updateBody.categoria_id = catInt;
          if (priInt !== orig.prioridad_id) updateBody.prioridad_id = priInt;
          if (Object.keys(updateBody).length > 0) {
            await apiPatch(`/tickets/${ticketId}`, updateBody);
          }
          await apiPatch(`/tickets/${ticketId}/estado`, { estado: 'Abierto' });
        }
      }

      alert('Responsables actualizados');
      loadTicket();
    } catch (err) {
      alert(err.data?.detail || 'Error al guardar responsables');
    } finally {
      btnGuardarResp.textContent = 'Guardar Responsables';
      btnGuardarResp.disabled = false;
    }
  });
}

// Cancelar ticket
if (btnCancelar) {
  btnCancelar.addEventListener('click', async () => {
    if (!confirm('¿Estás seguro de cancelar este ticket?')) return;
    try {
      await apiDelete(`/tickets/${ticketId}`);
      alert('Ticket cancelado');
      window.location.href = '/tickets';
    } catch (err) {
      alert(err.data?.detail || 'Error al cancelar');
    }
  });
}

// Observación
formObs.addEventListener('submit', async (e) => {
  e.preventDefault();
  const txt = document.getElementById('nueva-obs').value.trim();
  if (!txt) return;
  try {
    await apiPost(`/tickets/${ticketId}/observaciones`, { contenido: txt });
    document.getElementById('nueva-obs').value = '';
    loadTicket();
  } catch (err) {
    alert(err.data?.detail || 'Error al agregar observación');
  }
});

loadTicket();

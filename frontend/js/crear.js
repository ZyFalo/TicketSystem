import { apiPost } from './api.js';

const form = document.getElementById('crear-ticket-form');
const btnSubmit = document.getElementById('btn-submit');
const errorDiv = document.getElementById('crear-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const categoria = document.getElementById('categoria').value;
  const prioridad = document.getElementById('prioridad').value;
  const descripcion = document.getElementById('descripcion').value.trim();
  const lenguaje = document.getElementById('lenguaje').value;
  const codigo = document.getElementById('codigo').value.trim();

  // Validación básica del cliente
  if (!titulo || !categoria || !prioridad || !descripcion) {
    errorDiv.textContent = 'Por favor, completa todos los campos obligatorios.';
    return;
  }

  // Deshabilitar botón para evitar multi-envío
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Creando...';
  errorDiv.textContent = '';

  const payload = {
    titulo,
    categoria,
    prioridad,
    descripcion,
    fragmento_codigo: codigo ? codigo : null,
    lenguaje_codigo: codigo ? lenguaje : null
  };

  try {
    const data = await apiPost('/tickets', payload);
    // Redirigir al detalle del ticket recién creado
    if (data && data.id) {
      window.location.href = `/ticket/${data.id}`;
    } else {
      window.location.href = '/tickets';
    }
  } catch (err) {
    console.error(err);
    errorDiv.textContent = err.data?.message || err.data || 'Error al crear el ticket. Es posible que el servidor no responda.';
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Crear Ticket';
  }
});

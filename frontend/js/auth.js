import { apiPost } from './api.js';
import { showToast } from './toast.js';

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');

const btnShowRegister = document.getElementById('show-register');
const btnShowLogin = document.getElementById('show-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Toggle forms
btnShowRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.classList.remove('is-visible');
  loginSection.classList.add('is-hidden');
  registerSection.classList.remove('is-hidden');
  registerSection.classList.add('is-visible');
  loginError.textContent = '';
});

btnShowLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerSection.classList.remove('is-visible');
  registerSection.classList.add('is-hidden');
  loginSection.classList.remove('is-hidden');
  loginSection.classList.add('is-visible');
  registerError.textContent = '';
});

// Submit login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;

  loginError.textContent = '';
  try {
    await apiPost('/login', { email, password });
    window.location.href = '/tickets';
  } catch (err) {
    showToast(err.data?.message || err.data || 'Error al iniciar sesion', 'error');
  }
});

// Submit register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-pass').value;

  registerError.textContent = '';
  try {
    await apiPost('/register', { nombre, email, password });
    showToast('Cuenta creada exitosamente', 'success');
    window.location.href = '/tickets';
  } catch (err) {
    showToast(err.data?.message || err.data || 'Error al registrarse', 'error');
  }
});

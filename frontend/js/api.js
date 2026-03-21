const API_BASE_URL = '/api';

/**
 * Handle API responses
 */
async function handleResponse(response) {
  if (response.status === 401) {
    // Redirigir a login en caso de no autorizado rnf
    window.location.href = '/login';
    throw new Error('No autorizado');
  }

  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
}

/**
 * Default headers
 */
function getHeaders(customHeaders = {}) {
  return {
    'Content-Type': 'application/json',
    ...customHeaders
  };
}

/**
 * Perform GET request
 */
export async function apiGet(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
}

/**
 * Perform POST request
 */
export async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body)
  });

  return handleResponse(response);
}

/**
 * Perform PATCH request
 */
export async function apiPatch(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(body)
  });

  return handleResponse(response);
}

/**
 * Perform DELETE request
 */
export async function apiDelete(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  return handleResponse(response);
}

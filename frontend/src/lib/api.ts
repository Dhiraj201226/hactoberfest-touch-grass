// Support dynamic backend URL from environment or fallback to relative/Render URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://naturequest-api.onrender.com';
const API_BASE = `${BACKEND_URL.replace(/\/$/, '')}/api/v1`;

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('nq_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getMediaUrl(storageKey: string): string {
  if (!storageKey) return '';
  if (storageKey.startsWith('http')) return storageKey;
  return `${BACKEND_URL.replace(/\/$/, '')}/uploads/${storageKey}`;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  // If body is FormData, delete Content-Type to allow browser boundary calculation
  if (options.body instanceof FormData) {
    const mutableHeaders = headers as Record<string, string>;
    delete mutableHeaders['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network response was not ok' }));
    throw new Error(errorData.detail || errorData.message || 'Request failed');
  }

  return response.json();
}

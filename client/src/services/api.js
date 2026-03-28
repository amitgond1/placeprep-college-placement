import axios from 'axios';

function deriveRenderApiBaseUrl() {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  if (!host.endsWith('.onrender.com')) return null;

  const candidates = [
    host.replace(/-college-placement(?=\.onrender\.com$)/, '-college-placement-backend'),
    host.replace(/-college-placement(?=\.onrender\.com$)/, '-api'),
    host.replace(/-web(?=\.onrender\.com$)/, '-backend'),
    host.replace(/-web(?=\.onrender\.com$)/, '-api')
  ].filter(candidate => candidate !== host);

  if (!candidates.length) return null;
  return `https://${candidates[0]}/api`;
}

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  deriveRenderApiBaseUrl() ||
  '/api';

const api = axios.create({ baseURL: apiBaseUrl });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

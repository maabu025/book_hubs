import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 clear storage (token expired)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bh_token');
      localStorage.removeItem('bh_user');
    }
    return Promise.reject(err);
  }
);

export default api;

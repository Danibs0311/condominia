// Conteúdo do arquivo api.js em frontend/src/servicesimport axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export default api;

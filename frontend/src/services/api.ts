//src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // URL padrão do nosso Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token JWT Stateless em requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aegis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
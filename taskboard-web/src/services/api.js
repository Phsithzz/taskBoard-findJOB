import axios from 'axios'
import { useJobStore } from '../stores/useJobStore'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const pin = useJobStore.getState().accessPin
    if (pin) {
      config.headers['X-Access-PIN'] = pin
    }
  } catch {}
  return config
})

export const jobApi = {
  getAll: (signal) => api.get('/tasks', { signal }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  verifyPin: (pin) => api.post('/auth/verify', { pin }),
  getStatus: () => api.get('/auth/status'),
}

export default api

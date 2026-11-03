import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${apiUrl}/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const jobApi = {
  getAll: (signal) => api.get('', { signal }),
  create: (data) => api.post('', data),
  update: (id, data) => api.put(`/${id}`, data),
  delete: (id) => api.delete(`/${id}`),
}

export default api

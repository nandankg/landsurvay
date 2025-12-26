import api from '../config/api'

export const ownerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/owners', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/admin/owners/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/admin/owners', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/admin/owners/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/owners/${id}`)
    return response.data
  }
}

export default ownerService

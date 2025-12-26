import api from '../config/api'

export const propertyService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/properties', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/admin/properties/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/admin/properties', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/admin/properties/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/properties/${id}`)
    return response.data
  },

  getDistricts: async () => {
    const response = await api.get('/admin/properties/districts')
    return response.data
  }
}

export default propertyService

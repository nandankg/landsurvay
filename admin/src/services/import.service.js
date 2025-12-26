import api from '../config/api'

export const importService = {
  importFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/admin/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getTemplate: () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${baseUrl}/admin/import/template`
  },

  getLogs: async (params = {}) => {
    const response = await api.get('/admin/import/logs', { params })
    return response.data
  }
}

export default importService

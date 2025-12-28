import api from '../config/api'

export const documentService = {
  upload: async (propertyId, files, description = '') => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('documents', file)
    })
    if (description) {
      formData.append('description', description)
    }

    const response = await api.post(`/admin/properties/${propertyId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/admin/documents/${id}`)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/documents/${id}`)
    return response.data
  },

  getDownloadUrl: (id) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${baseUrl}/documents/${id}/download`
  },

  getViewUrl: (id) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${baseUrl}/documents/${id}/view`
  }
}

export default documentService

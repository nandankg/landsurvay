import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance for public endpoints (no auth required)
const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor - handle errors
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(new Error('Network error. Please check your connection.'))
  }
)

export const publicService = {
  // Search by mobile number
  searchByMobile: async (phone) => {
    const response = await publicApi.get(`/search/mobile/${phone}`)
    return response.data
  },

  // Search by Aadhaar number
  searchByAadhaar: async (aadhaar) => {
    const response = await publicApi.get(`/search/aadhaar/${aadhaar}`)
    return response.data
  },

  // Search by Property ID
  searchByPropertyId: async (propertyId) => {
    const response = await publicApi.get(`/search/property/${propertyId}`)
    return response.data
  },

  // Get property details
  getPropertyDetails: async (id) => {
    const response = await publicApi.get(`/properties/${id}`)
    return response.data
  },

  // Get property documents
  getPropertyDocuments: async (id) => {
    const response = await publicApi.get(`/properties/${id}/documents`)
    return response.data
  },

  // Get document view URL (for inline preview)
  getDocumentViewUrl: (id) => {
    return `${API_URL}/documents/${id}/view`
  },

  // Get document download URL
  getDocumentDownloadUrl: (id) => {
    return `${API_URL}/documents/${id}/download`
  }
}

export default publicService

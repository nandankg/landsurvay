import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('admin')
        window.location.href = '/login'
      }

      // Return error message from API
      const message = error.response.data?.message || 'An error occurred'
      return Promise.reject(new Error(message))
    }

    // Network error
    return Promise.reject(new Error('Network error. Please check your connection.'))
  }
)

export default api

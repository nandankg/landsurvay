import api from '../config/api'

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/admin/login', { username, password })
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/admin/me')
    return response.data
  },

  getDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  }
}

export default authService

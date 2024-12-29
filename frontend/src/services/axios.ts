import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'
axios.defaults.baseURL = baseURL
axios.defaults.headers.common['Content-Type'] = 'application/json'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axios

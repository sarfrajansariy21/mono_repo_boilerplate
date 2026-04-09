import { createApiClient, setAccessToken as sharedSetAccessToken, getAccessToken } from '@monorepo/api-client'

export { getAccessToken }

const api = createApiClient(import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1')

export const setAccessToken = (token: string | null) => {
  sharedSetAccessToken(token)
  if (token) {
    sessionStorage.setItem('auth_token', token)
  } else {
    sessionStorage.removeItem('auth_token')
  }
}

// Initialize token from storage if present
const storedToken = sessionStorage.getItem('auth_token')
if (storedToken) {
  sharedSetAccessToken(storedToken)
}

export const apiService = {
  get: (url: string) => api.get(url),
  post: (url: string, data: any) => api.post(url, data),
  put: (url: string, data: any) => api.put(url, data),
  delete: (url: string) => api.delete(url),
}

export default api

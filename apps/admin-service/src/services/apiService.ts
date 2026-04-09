import { createApiClient } from '@monorepo/api-client'

const api = createApiClient(import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1')

// For now, simple implementation
export const apiService = {
  post: (url: string, data: any) => api.post(url, data),
}

export default api

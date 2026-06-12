const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getApiUrl(endpoint: string) {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_BASE_URL')
  }

  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`
}

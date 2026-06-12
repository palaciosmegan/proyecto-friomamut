const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

export function getApiUrl(endpoint: string) {
  if (!API_BASE_URL) {
    return `/${endpoint.replace(/^\/+/, '')}`
  }

  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`
}

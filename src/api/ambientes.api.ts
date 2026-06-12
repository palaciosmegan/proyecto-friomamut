import type { Ambiente } from '../config/ambientes.config'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TUNELES_ENDPOINT = '/api/tuneles'

function getApiUrl(endpoint: string) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`
}

function isAmbiente(value: unknown): value is Ambiente {
  if (typeof value !== 'object' || value === null) return false

  const ambiente = value as Record<string, unknown>
  return typeof ambiente.id === 'number' && typeof ambiente.label === 'string'
}

export async function obtenerAmbientes(): Promise<Ambiente[]> {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_BASE_URL')
  }

  const url = getApiUrl(TUNELES_ENDPOINT)

  console.info('[API tuneles] Consultando:', url)

  let response: Response

  try {
    response = await fetch(url)
  } catch (cause) {
    throw new Error(
      `No se pudo conectar con ${url}. Verifica la IP, el puerto, Node-RED y CORS.`,
      { cause },
    )
  }

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `La API ${url} respondio HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacia)'}`,
    )
  }

  let data: unknown

  try {
    data = await response.json()
  } catch (cause) {
    throw new Error(`La API ${url} no devolvio JSON valido.`, { cause })
  }

  if (!Array.isArray(data) || !data.every(isAmbiente)) {
    throw new Error(
      `La respuesta de ${url} no tiene el formato esperado [{ id: number, label: string }]. Recibido: ${JSON.stringify(data)}`,
    )
  }

  console.info('[API tuneles] Respuesta recibida:', data)
  return data
}

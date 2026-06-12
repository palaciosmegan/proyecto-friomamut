import type { Ambiente } from '../config/ambientes.config'
import { getApiUrl } from './api.config'

const TUNELES_ENDPOINT = '/api/tuneles'

function isAmbiente(value: unknown): value is Ambiente {
  if (typeof value !== 'object' || value === null) return false

  const ambiente = value as Record<string, unknown>
  return typeof ambiente.id === 'number' && typeof ambiente.label === 'string'
}

export async function obtenerAmbientes(): Promise<Ambiente[]> {
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

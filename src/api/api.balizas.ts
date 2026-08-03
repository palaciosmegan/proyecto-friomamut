import { getApiUrl } from './api.config'
import { ApiError } from './api.errors'

export type Semaforo = 'verde' | 'ambar' | 'rojo'

export type ApiBaliza = {
  id: number,
  label: string,
  processActive?: boolean
  int: null | number
  ext: null | number
  status?: null | 'verde' | 'ambar' | 'rojo'
}

type ActualizarBaliza = {
  id: number,
  int: null | number
  ext: null | number
  status: null | 'verde' | 'ambar' | 'rojo'
}

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondió HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacía)'}`,
  )
}

const normalizarBalizas = (data: unknown): ApiBaliza[] => {
  if (!Array.isArray(data)) {
    throw new ApiError('format', 'La respuesta de balizas no tiene la estructura esperada')
  }

  return data as ApiBaliza[]
}

export async function obtenerBalizas(): Promise<ApiBaliza[]> {
  const url = getApiUrl('/api/beacons')
  const response = await fetch(url)
  await validarResponse(response, url)

  const data: unknown = await response.json()
  return normalizarBalizas(data)
}

export async function actualizarBaliza(request: ActualizarBaliza) {
  const url = getApiUrl('/api/beacons')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  await validarResponse(response, url)
}
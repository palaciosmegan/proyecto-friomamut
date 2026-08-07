import { getApiUrl } from './api.config'
import { ApiError } from './api.errors'

// Dead-band (histéresis) global. Extiende el rango ±valor cuando el color ya
// está activo. Válido 0–5 °C. El backend responde { dead_band, unidad }.

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondió HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacía)'}`,
  )
}

const normalizarDeadband = (data: unknown): number => {
  if (typeof data !== 'object' || data === null || typeof (data as { dead_band?: unknown }).dead_band !== 'number') {
    throw new ApiError('format', 'La respuesta de dead-band no tiene la estructura esperada')
  }

  return (data as { dead_band: number }).dead_band
}

export async function obtenerDeadband(): Promise<number> {
  const url = getApiUrl('/api/deadband')
  const response = await fetch(url)
  await validarResponse(response, url)

  const data: unknown = await response.json()
  return normalizarDeadband(data)
}

export async function actualizarDeadband(deadBand: number): Promise<void> {
  const url = getApiUrl('/api/deadband')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dead_band: deadBand }),
  })

  await validarResponse(response, url)
}

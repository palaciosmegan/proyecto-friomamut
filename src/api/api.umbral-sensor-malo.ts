import { getApiUrl } from './api.config'
import { ApiError } from './api.errors'

// Umbral de "sensor malo" global. Los sensores con valor >= umbral se ignoran
// en toda evaluación de balizas. El backend responde { umbral_sensor_malo, unidad }.

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondió HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacía)'}`,
  )
}

const normalizarUmbral = (data: unknown): number => {
  if (typeof data !== 'object' || data === null || typeof (data as { umbral_sensor_malo?: unknown }).umbral_sensor_malo !== 'number') {
    throw new ApiError('format', 'La respuesta de umbral sensor malo no tiene la estructura esperada')
  }

  return (data as { umbral_sensor_malo: number }).umbral_sensor_malo
}

export async function obtenerUmbralSensorMalo(): Promise<number> {
  const url = getApiUrl('/api/umbral-sensor-malo')
  const response = await fetch(url)
  await validarResponse(response, url)

  const data: unknown = await response.json()
  return normalizarUmbral(data)
}

export async function actualizarUmbralSensorMalo(umbral: number): Promise<void> {
  const url = getApiUrl('/api/umbral-sensor-malo')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ umbral_sensor_malo: umbral }),
  })

  await validarResponse(response, url)
}

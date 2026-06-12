import type { Orientation, Sensor } from '../types/sensor.types'
import { getApiUrl } from './api.config'

type SensorApi = {
  sensorId?: unknown
  id?: unknown
  orientation?: unknown
  posicion?: unknown
  habilitado?: unknown
  valor?: unknown
}

function getSensoresArray(data: unknown, ambienteId: number): unknown[] {
  if (Array.isArray(data)) return data

  if (typeof data === 'object' && data !== null) {
    const sensores = (data as Record<string, unknown>)[String(ambienteId)]
    if (Array.isArray(sensores)) return sensores
  }

  throw new Error(`La estructura no contiene un arreglo para el ambiente ${ambienteId}`)
}

function isOrientation(value: unknown): value is Orientation {
  return value === 'INT' || value === 'EXT'
}

function normalizarSensor(value: unknown): Sensor {
  if (typeof value !== 'object' || value === null) {
    throw new Error('La estructura contiene un sensor invalido')
  }

  const sensor = value as SensorApi

  if (
    (typeof sensor.sensorId !== 'number' && sensor.sensorId !== null)
    || typeof sensor.id !== 'string'
    || !isOrientation(sensor.orientation)
    || typeof sensor.posicion !== 'number'
    || typeof sensor.habilitado !== 'boolean'
    || (typeof sensor.valor !== 'number' && sensor.valor !== null)
  ) {
    throw new Error(`Sensor invalido: ${JSON.stringify(value)}`)
  }

  return {
    sensorId: typeof sensor.sensorId === 'number' ? sensor.sensorId : undefined,
    id: sensor.id,
    orientation: sensor.orientation,
    posicion: sensor.posicion,
    habilitado: sensor.habilitado,
    valor: typeof sensor.valor === 'number' ? sensor.valor : null,
  }
}

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondio HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacia)'}`,
  )
}

export async function obtenerSensores(ambienteId: number): Promise<Sensor[]> {
  const url = getApiUrl(`/api/environments/${ambienteId}/active-process/structure`)
  const response = await fetch(url)
  await validarResponse(response, url)

  const data: unknown = await response.json()
  return getSensoresArray(data, ambienteId).map(normalizarSensor)
}

export async function actualizarSensorActivo(
  ambienteId: number,
  sensorId: number,
  active: boolean,
) {
  const url = getApiUrl(`/api/environments/${ambienteId}/active-process/sensors/active`)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sensors: [{ id: sensorId, active }],
    }),
  })

  await validarResponse(response, url)
}

import type { Orientation, Sensor } from '../types/sensor.types'
import { getApiUrl } from './api.config'

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

function isOptionalNumber(value: unknown): value is number | null | undefined {
  return typeof value === 'number' || value === null || value === undefined
}

function normalizarSensor(value: unknown): Sensor {
  if (typeof value !== 'object' || value === null) {
    throw new Error('La estructura contiene un sensor invalido')
  }

  const sensor = value as Sensor

  if (
    (typeof sensor.sensorId !== 'number' && sensor.sensorId !== null && sensor.sensorId !== undefined)
    || typeof sensor.registroAmbiente !== 'number'
    || !isOptionalNumber(sensor.registroAmbienteLectura)
    || !isOptionalNumber(sensor.registroAmbienteEstructura)
    || !isOptionalNumber(sensor.registroSensor)
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
    codigoLectura: sensor.codigoLectura,
    registroAmbiente: sensor.registroAmbiente,
    registroAmbienteLectura: typeof sensor.registroAmbienteLectura === 'number' ? sensor.registroAmbienteLectura : undefined,
    registroAmbienteEstructura: typeof sensor.registroAmbienteEstructura === 'number' ? sensor.registroAmbienteEstructura : undefined,
    registroSensor: typeof sensor.registroSensor === 'number' ? sensor.registroSensor : undefined,
    environmentAbbreviation: sensor.environmentAbbreviation,
    orientation: sensor.orientation,
    posicion: sensor.posicion,
    habilitado: sensor.habilitado,
    valor: typeof sensor.valor === 'number' ? sensor.valor : null,
    active: sensor.active,
    unidad: sensor.unidad
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
  registroAmbienteEstructura: number,
  registroSensor: number,
  active: boolean,
) {
  const url = getApiUrl('/api/environments/active-process/sensors/active')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ambiente: registroAmbienteEstructura,
      sensors: [{ sensor: registroSensor, active }],
    }),
  })

  await validarResponse(response, url)
}

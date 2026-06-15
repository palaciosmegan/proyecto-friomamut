import { getApiUrl } from './api.config'

// ── Tipos de la respuesta de la API ────────────────────────

type ApiSensor = {
  sensor?: unknown
  codigo?: unknown
  offset?: unknown
}

type ApiAmbiente = {
  ambienteRegistro?: unknown
  sensores?: unknown
}

type ApiResponse = {
  ok?: unknown
  ambientes?: unknown
}

// ── Tipos del request del POST ─────────────────────────────

type ActualizarOffsetDirecto = {
  ambiente: number
  sensor: number
  offset: number
  visibilidad: boolean | null
}

type ActualizarOffsetCalculado = {
  ambiente: number
  sensor: number
  valorRaw: number
  valor: number
  visibilidad: boolean | null
}

// Record<ambienteRegistro, Record<sensorCodigo, offset>>
export type CalibratorOffsetMap = Record<number, Record<string, number>>

export type ActualizarOffsetRequest = ActualizarOffsetDirecto | ActualizarOffsetCalculado | ActualizarOffsetDirecto[]

// ── Normalización ──────────────────────────────────────────

function normalizarOffsetMap(data: unknown): CalibratorOffsetMap {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('La respuesta de offsets no tiene la estructura esperada')
  }

  const response = data as ApiResponse

  if (!Array.isArray(response.ambientes)) {
    throw new Error('La respuesta no contiene un array de ambientes')
  }

  const result: CalibratorOffsetMap = {}

  for (const amb of response.ambientes) {
    const ambiente = amb as ApiAmbiente

    if (typeof ambiente.ambienteRegistro !== 'number') {
      throw new Error(`ambienteRegistro inválido: ${JSON.stringify(amb)}`)
    }

    if (!Array.isArray(ambiente.sensores)) {
      throw new Error(`sensores inválido para ambiente ${ambiente.ambienteRegistro}`)
    }

    result[ambiente.ambienteRegistro] = {}

    for (const sen of ambiente.sensores) {
      const sensor = sen as ApiSensor

      if (typeof sensor.codigo !== 'string' || typeof sensor.offset !== 'number') {
        throw new Error(`Sensor inválido: ${JSON.stringify(sen)}`)
      }

      result[ambiente.ambienteRegistro][sensor.codigo] = sensor.offset
    }
  }

  return result
}

// ── Validación de response HTTP ────────────────────────────

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondió HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacía)'}`,
  )
}

// ── Endpoints ──────────────────────────────────────────────

export async function obtenerOffsets(): Promise<CalibratorOffsetMap> {
  const url = getApiUrl('/api/calibrator/offsets')
  const response = await fetch(url)
  await validarResponse(response, url)

  const data: unknown = await response.json()
  return normalizarOffsetMap(data)
}

export async function actualizarOffset(request: ActualizarOffsetRequest): Promise<void> {
  const url = getApiUrl('/api/calibrator/offsets')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  await validarResponse(response, url)
}
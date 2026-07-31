import { getApiUrl } from './api.config'

export type ApiProcesoAmbiente = {
  tunel: number
  label: string | null
  tieneProceso: boolean
  codigoProceso: string | null
  updatedAt: string | null
}

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondió HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacía)'}`,
  )
}

const normalizarProcesos = (data: unknown): ApiProcesoAmbiente[] => {
  if (!Array.isArray(data)) {
    throw new Error('La respuesta de procesos-ambiente no tiene la estructura esperada')
  }

  return data as ApiProcesoAmbiente[]
}

export async function obtenerProcesosAmbiente(): Promise<ApiProcesoAmbiente[]> {
  const url = getApiUrl('/api/procesos-ambiente')
  const response = await fetch(url)
  await validarResponse(response, url)

  const data: unknown = await response.json()
  return normalizarProcesos(data)
}

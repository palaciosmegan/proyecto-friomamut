import { getApiUrl } from './api.config'
import type { RangoSetpoint } from './api.balizas'

export type ActualizarSetpoints = {
  cambio_flujo?: { interno?: RangoSetpoint; externo?: RangoSetpoint }
  fin_proceso?: { interno?: RangoSetpoint; externo?: RangoSetpoint }
  pulpa?: number
}

async function validarResponse(response: Response, url: string) {
  if (response.ok) return

  const body = await response.text()
  throw new Error(
    `La API ${url} respondió HTTP ${response.status} ${response.statusText}. Respuesta: ${body || '(vacía)'}`,
  )
}

// Solo los campos enviados se modifican; el resto conserva su valor actual en el servidor.
export async function actualizarSetpoints(tunelId: number, setpoints: ActualizarSetpoints): Promise<void> {
  const url = getApiUrl(`/api/setpoints/${tunelId}`)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(setpoints),
  })

  await validarResponse(response, url)
}

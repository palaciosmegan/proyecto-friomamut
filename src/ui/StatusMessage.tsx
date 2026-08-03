import { Message } from './Message'
import type { ApiErrorKind } from '../api/api.errors'

interface StatusMessageProps {
  loaded: boolean
  error: ApiErrorKind | null
  labels: { fetch: string; format: string; empty: string }
}

// Muestra el mensaje adecuado cuando un recurso no tiene datos que mostrar:
// distingue fallo de conexión, respuesta con formato inesperado, o vacío legítimo.
// Devuelve null mientras aún carga (para no mostrar nada prematuro).
export function StatusMessage({ loaded, error, labels }: StatusMessageProps) {
  if (!loaded) return null
  const text = error === 'fetch' ? labels.fetch : error === 'format' ? labels.format : labels.empty
  return <Message text={text} />
}

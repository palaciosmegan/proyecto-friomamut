// Categoría de fallo de una lectura de API, para que las vistas puedan
// distinguir el mensaje a mostrar sin depender del texto del error.
//   'fetch'  → no se pudo conectar / HTTP no-ok (red, 404, 500, CORS)
//   'format' → el servidor respondió pero con una estructura inesperada
export type ApiErrorKind = 'fetch' | 'format'

export class ApiError extends Error {
  kind: ApiErrorKind

  constructor(kind: ApiErrorKind, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.kind = kind
  }
}

// Un error de formato viene tipado como ApiError('format'); cualquier otra cosa
// (red, HTTP, TypeError de fetch) se trata como fallo de conexión.
export function apiErrorKind(error: unknown): ApiErrorKind {
  return error instanceof ApiError ? error.kind : 'fetch'
}

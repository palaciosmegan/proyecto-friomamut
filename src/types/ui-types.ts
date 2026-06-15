export type PendingChange = { offset: number; visibilidad: boolean }

export const ChipStatus = {
  LIVE: 'LIVE',
  RECONNECTING: 'RECONNECTING',
  ERROR: 'ERROR',
} as const
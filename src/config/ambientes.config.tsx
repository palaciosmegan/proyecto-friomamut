export type Ambiente = {
  id: number
  label: string
}

// Se usa unicamente cuando el servidor no esta disponible.
export const AMBIENTES: Ambiente[] = [
  { id: 1, label: 'TUNEL PT 01' },
  { id: 2, label: 'TUNEL PT 02' },
  { id: 3, label: 'TUNEL PT 03' },
  { id: 4, label: 'TUNEL PT 04' },
]

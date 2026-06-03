// Columnas P1–P8 distribuidas entre x=0.18 y x=0.78
// (deja margen izq para panel ambiente, margen der para evaporador)
// Filas:
//   ext_superior → y ≈ 0.18
//   int_superior → y ≈ 0.42
//   int_inferior → y ≈ 0.58
//   ext_inferior → y ≈ 0.82
export type Fila = 'ext_superior' | 'int_superior' | 'int_inferior' | 'ext_inferior'

export type SensorMock = {
  posicion: number
  columna: string
  fila: Fila
  id: string
  valor: number
  habilitado: boolean
}

export const MOCK_SENSORES: Record<number, SensorMock[]> = {
  1: [
    { posicion: 1,  columna: "P1", fila: "ext_superior", id: "S01", valor: -18.4, habilitado: true },
    { posicion: 2,  columna: "P1", fila: "int_superior", id: "S02", valor: -19.1, habilitado: true },
    { posicion: 3,  columna: "P2", fila: "ext_superior", id: "S03", valor: -18.7, habilitado: true },
    { posicion: 4,  columna: "P2", fila: "int_superior", id: "S04", valor: -20.2, habilitado: true },
    { posicion: 5,  columna: "P3", fila: "ext_superior", id: "S05", valor: -17.9, habilitado: true },
    { posicion: 6,  columna: "P3", fila: "int_superior", id: "S06", valor: -19.5, habilitado: false },
    { posicion: 7,  columna: "P4", fila: "ext_superior", id: "S07", valor: -18.3, habilitado: true },
    { posicion: 8,  columna: "P4", fila: "int_superior", id: "S08", valor: -20.8, habilitado: true },
    { posicion: 17, columna: "P1", fila: "int_inferior", id: "S09", valor: -21.3, habilitado: true },
    { posicion: 18, columna: "P1", fila: "ext_inferior", id: "S10", valor: -20.1, habilitado: true },
    { posicion: 19, columna: "P2", fila: "int_inferior", id: "S11", valor: -19.8, habilitado: true },
    { posicion: 20, columna: "P2", fila: "ext_inferior", id: "S12", valor: -21.0, habilitado: false },
    { posicion: 21, columna: "P3", fila: "int_inferior", id: "S13", valor: -18.6, habilitado: true },
    { posicion: 22, columna: "P3", fila: "ext_inferior", id: "S14", valor: -20.4, habilitado: true },
    { posicion: 23, columna: "P4", fila: "int_inferior", id: "S15", valor: -19.2, habilitado: true },
    { posicion: 24, columna: "P4", fila: "ext_inferior", id: "S16", valor: -21.5, habilitado: true },
  ],
  2: [
    { posicion: 1,  columna: "P1", fila: "ext_superior", id: "S01", valor: -22.1, habilitado: true },
    { posicion: 2,  columna: "P1", fila: "int_superior", id: "S02", valor: -23.4, habilitado: true },
    { posicion: 3,  columna: "P2", fila: "ext_superior", id: "S03", valor: -22.8, habilitado: true },
    { posicion: 4,  columna: "P2", fila: "int_superior", id: "S04", valor: -23.9, habilitado: false },
    { posicion: 5,  columna: "P3", fila: "ext_superior", id: "S05", valor: -22.3, habilitado: true },
    { posicion: 6,  columna: "P3", fila: "int_superior", id: "S06", valor: -24.1, habilitado: true },
    { posicion: 7,  columna: "P4", fila: "ext_superior", id: "S07", valor: -23.0, habilitado: true },
    { posicion: 8,  columna: "P4", fila: "int_superior", id: "S08", valor: -22.6, habilitado: true },
    { posicion: 9,  columna: "P5", fila: "ext_superior", id: "S09", valor: -23.7, habilitado: true },
    { posicion: 10, columna: "P5", fila: "int_superior", id: "S10", valor: -22.9, habilitado: true },
    { posicion: 17, columna: "P1", fila: "int_inferior", id: "S11", valor: -24.3, habilitado: true },
    { posicion: 18, columna: "P1", fila: "ext_inferior", id: "S12", valor: -23.1, habilitado: true },
    { posicion: 19, columna: "P2", fila: "int_inferior", id: "S13", valor: -22.5, habilitado: false },
    { posicion: 20, columna: "P2", fila: "ext_inferior", id: "S14", valor: -24.0, habilitado: true },
    { posicion: 21, columna: "P3", fila: "int_inferior", id: "S15", valor: -23.6, habilitado: true },
    { posicion: 22, columna: "P3", fila: "ext_inferior", id: "S16", valor: -22.2, habilitado: true },
    { posicion: 23, columna: "P4", fila: "int_inferior", id: "S17", valor: -23.8, habilitado: true },
    { posicion: 24, columna: "P4", fila: "ext_inferior", id: "S18", valor: -24.5, habilitado: true },
    { posicion: 25, columna: "P5", fila: "int_inferior", id: "S19", valor: -22.7, habilitado: true },
    { posicion: 26, columna: "P5", fila: "ext_inferior", id: "S20", valor: -23.3, habilitado: false },
  ],
  3: [
    { posicion: 1,  columna: "P1", fila: "ext_superior", id: "S01", valor: -15.2, habilitado: true },
    { posicion: 2,  columna: "P1", fila: "int_superior", id: "S02", valor: -16.0, habilitado: true },
    { posicion: 3,  columna: "P2", fila: "ext_superior", id: "S03", valor: -14.8, habilitado: true },
    { posicion: 4,  columna: "P2", fila: "int_superior", id: "S04", valor: -15.5, habilitado: true },
    { posicion: 5,  columna: "P3", fila: "ext_superior", id: "S05", valor: -16.3, habilitado: false },
    { posicion: 6,  columna: "P3", fila: "int_superior", id: "S06", valor: -15.1, habilitado: true },
    { posicion: 17, columna: "P1", fila: "int_inferior", id: "S07", valor: -16.7, habilitado: true },
    { posicion: 18, columna: "P1", fila: "ext_inferior", id: "S08", valor: -15.9, habilitado: true },
    { posicion: 19, columna: "P2", fila: "int_inferior", id: "S09", valor: -14.6, habilitado: true },
    { posicion: 20, columna: "P2", fila: "ext_inferior", id: "S10", valor: -16.1, habilitado: true },
    { posicion: 21, columna: "P3", fila: "int_inferior", id: "S11", valor: -15.4, habilitado: false },
    { posicion: 22, columna: "P3", fila: "ext_inferior", id: "S12", valor: -16.5, habilitado: true },
  ],
  4: [
    { posicion: 1,  columna: "P1", fila: "ext_superior", id: "S01", valor: -25.1, habilitado: true },
    { posicion: 2,  columna: "P1", fila: "int_superior", id: "S02", valor: -26.3, habilitado: true },
    { posicion: 3,  columna: "P2", fila: "ext_superior", id: "S03", valor: -25.8, habilitado: true },
    { posicion: 4,  columna: "P2", fila: "int_superior", id: "S04", valor: -26.0, habilitado: false },
    { posicion: 5,  columna: "P3", fila: "ext_superior", id: "S05", valor: -25.4, habilitado: true },
    { posicion: 6,  columna: "P3", fila: "int_superior", id: "S06", valor: -26.7, habilitado: true },
    { posicion: 7,  columna: "P4", fila: "ext_superior", id: "S07", valor: -25.2, habilitado: true },
    { posicion: 8,  columna: "P4", fila: "int_superior", id: "S08", valor: -26.9, habilitado: true },
    { posicion: 9,  columna: "P5", fila: "ext_superior", id: "S09", valor: -25.6, habilitado: false },
    { posicion: 10, columna: "P5", fila: "int_superior", id: "S10", valor: -26.2, habilitado: true },
    { posicion: 11, columna: "P6", fila: "ext_superior", id: "S11", valor: -25.9, habilitado: true },
    { posicion: 12, columna: "P6", fila: "int_superior", id: "S12", valor: -26.5, habilitado: true },
    { posicion: 17, columna: "P1", fila: "int_inferior", id: "S13", valor: -26.8, habilitado: true },
    { posicion: 18, columna: "P1", fila: "ext_inferior", id: "S14", valor: -25.3, habilitado: true },
    { posicion: 19, columna: "P2", fila: "int_inferior", id: "S15", valor: -26.1, habilitado: true },
    { posicion: 20, columna: "P2", fila: "ext_inferior", id: "S16", valor: -25.7, habilitado: false },
    { posicion: 21, columna: "P3", fila: "int_inferior", id: "S17", valor: -26.4, habilitado: true },
    { posicion: 22, columna: "P3", fila: "ext_inferior", id: "S18", valor: -25.5, habilitado: true },
    { posicion: 23, columna: "P4", fila: "int_inferior", id: "S19", valor: -26.6, habilitado: true },
    { posicion: 24, columna: "P4", fila: "ext_inferior", id: "S20", valor: -25.0, habilitado: true },
    { posicion: 25, columna: "P5", fila: "int_inferior", id: "S21", valor: -26.3, habilitado: false },
    { posicion: 26, columna: "P5", fila: "ext_inferior", id: "S22", valor: -25.8, habilitado: true },
    { posicion: 27, columna: "P6", fila: "int_inferior", id: "S23", valor: -26.0, habilitado: true },
    { posicion: 28, columna: "P6", fila: "ext_inferior", id: "S24", valor: -25.4, habilitado: true },
  ],
}
// Columnas: pares de posiciones agrupadas de a 2 por palet
//   1,2,17,18 → P1 | 3,4,19,20 → P2 | 5,6,21,22 → P3 | 7,8,23,24 → P4
//   9,10,25,26 → P5 | 11,12,27,28 → P6 | 13,14,29,30 → P7 | 15,16,31,32 → P8
//
// Fila: impar → int_*, par → ext_*
//   1–16  impar → int_superior  | par → ext_superior
//   17–32 impar → int_inferior  | par → ext_inferior
//   101 → ambiente | 102 → retorno (excepciones, no siguen la regla de paridad)

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
    { posicion: 1,   columna: 'P1', fila: 'int_superior', id: 'T01 S01', valor: -18.4, habilitado: true },
    { posicion: 2,   columna: 'P1', fila: 'ext_superior', id: 'T01 S02', valor: -19.1, habilitado: true },
    { posicion: 3,   columna: 'P2', fila: 'int_superior', id: 'T01 S03', valor: -18.7, habilitado: true },
    { posicion: 4,   columna: 'P2', fila: 'ext_superior', id: 'T01 S04', valor: -20.2, habilitado: true },
    { posicion: 5,   columna: 'P3', fila: 'int_superior', id: 'T01 S05', valor: -17.9, habilitado: true },
    { posicion: 6,   columna: 'P3', fila: 'ext_superior', id: 'T01 S06', valor: -19.5, habilitado: false },
    { posicion: 7,   columna: 'P4', fila: 'int_superior', id: 'T01 S07', valor: -18.3, habilitado: true },
    { posicion: 8,   columna: 'P4', fila: 'ext_superior', id: 'T01 S08', valor: -20.8, habilitado: true },
    { posicion: 17,  columna: 'P1', fila: 'int_inferior', id: 'T01 S09', valor: -21.3, habilitado: true },
    { posicion: 18,  columna: 'P1', fila: 'ext_inferior', id: 'T01 S10', valor: -20.1, habilitado: true },
    { posicion: 19,  columna: 'P2', fila: 'int_inferior', id: 'T01 S11', valor: -19.8, habilitado: true },
    { posicion: 20,  columna: 'P2', fila: 'ext_inferior', id: 'T01 S12', valor: -21.0, habilitado: false },
    { posicion: 21,  columna: 'P3', fila: 'int_inferior', id: 'T01 S13', valor: -18.6, habilitado: true },
    { posicion: 22,  columna: 'P3', fila: 'ext_inferior', id: 'T01 S14', valor: -20.4, habilitado: true },
    { posicion: 23,  columna: 'P4', fila: 'int_inferior', id: 'T01 S15', valor: -19.2, habilitado: true },
    { posicion: 32,  columna: 'P4', fila: 'ext_inferior', id: 'T01 S16', valor: -21.5, habilitado: true },
    { posicion: 101, columna: 'P1', fila: 'ext_inferior', id: 'A01',     valor: -21.5, habilitado: true },
    { posicion: 102, columna: 'P4', fila: 'ext_inferior', id: 'A02',     valor: -21.5, habilitado: true },
  ],
  2: [
    { posicion: 1,   columna: 'P1', fila: 'int_superior', id: 'T02 S01', valor: -22.1, habilitado: true },
    { posicion: 2,   columna: 'P1', fila: 'ext_superior', id: 'T02 S02', valor: -23.4, habilitado: true },
    { posicion: 3,   columna: 'P2', fila: 'int_superior', id: 'T02 S03', valor: -22.8, habilitado: true },
    { posicion: 4,   columna: 'P2', fila: 'ext_superior', id: 'T02 S04', valor: -23.9, habilitado: false },
    { posicion: 5,   columna: 'P3', fila: 'int_superior', id: 'T02 S05', valor: -22.3, habilitado: true },
    { posicion: 6,   columna: 'P3', fila: 'ext_superior', id: 'T02 S06', valor: -24.1, habilitado: true },
    { posicion: 7,   columna: 'P4', fila: 'int_superior', id: 'T02 S07', valor: -23.0, habilitado: true },
    { posicion: 8,   columna: 'P4', fila: 'ext_superior', id: 'T02 S08', valor: -22.6, habilitado: true },
    { posicion: 9,   columna: 'P5', fila: 'int_superior', id: 'T02 S09', valor: -23.7, habilitado: true },
    { posicion: 10,  columna: 'P5', fila: 'ext_superior', id: 'T02 S10', valor: -22.9, habilitado: true },
    { posicion: 17,  columna: 'P1', fila: 'int_inferior', id: 'T02 S11', valor: -24.3, habilitado: true },
    { posicion: 18,  columna: 'P1', fila: 'ext_inferior', id: 'T02 S12', valor: -23.1, habilitado: true },
    { posicion: 19,  columna: 'P2', fila: 'int_inferior', id: 'T02 S13', valor: -22.5, habilitado: false },
    { posicion: 20,  columna: 'P2', fila: 'ext_inferior', id: 'T02 S14', valor: -24.0, habilitado: true },
    { posicion: 21,  columna: 'P3', fila: 'int_inferior', id: 'T02 S15', valor: -23.6, habilitado: true },
    { posicion: 22,  columna: 'P3', fila: 'ext_inferior', id: 'T02 S16', valor: -22.2, habilitado: true },
    { posicion: 23,  columna: 'P4', fila: 'int_inferior', id: 'T02 S17', valor: -23.8, habilitado: true },
    { posicion: 24,  columna: 'P4', fila: 'ext_inferior', id: 'T02 S18', valor: -24.5, habilitado: true },
    { posicion: 25,  columna: 'P5', fila: 'int_inferior', id: 'T02 S19', valor: -22.7, habilitado: true },
    { posicion: 26,  columna: 'P5', fila: 'ext_inferior', id: 'T02 S20', valor: -23.3, habilitado: false },
    { posicion: 101, columna: 'P1', fila: 'ext_inferior', id: 'A01',     valor: -21.5, habilitado: true },
    { posicion: 102, columna: 'P5', fila: 'ext_inferior', id: 'A02',     valor: -21.5, habilitado: true },
  ],
  3: [
    { posicion: 1,   columna: 'P1', fila: 'int_superior', id: 'T03 S01', valor: -15.2, habilitado: true },
    { posicion: 2,   columna: 'P1', fila: 'ext_superior', id: 'T03 S02', valor: -16.0, habilitado: true },
    { posicion: 3,   columna: 'P2', fila: 'int_superior', id: 'T03 S03', valor: -14.8, habilitado: true },
    { posicion: 4,   columna: 'P2', fila: 'ext_superior', id: 'T03 S04', valor: -15.5, habilitado: true },
    { posicion: 5,   columna: 'P3', fila: 'int_superior', id: 'T03 S05', valor: -16.3, habilitado: false },
    { posicion: 6,   columna: 'P3', fila: 'ext_superior', id: 'T03 S06', valor: -15.1, habilitado: true },
    { posicion: 17,  columna: 'P1', fila: 'int_inferior', id: 'T03 S07', valor: -16.7, habilitado: true },
    { posicion: 18,  columna: 'P1', fila: 'ext_inferior', id: 'T03 S08', valor: -15.9, habilitado: true },
    { posicion: 19,  columna: 'P2', fila: 'int_inferior', id: 'T03 S09', valor: -14.6, habilitado: true },
    { posicion: 20,  columna: 'P2', fila: 'ext_inferior', id: 'T03 S10', valor: -16.1, habilitado: true },
    { posicion: 21,  columna: 'P3', fila: 'int_inferior', id: 'T03 S11', valor: -15.4, habilitado: false },
    { posicion: 22,  columna: 'P3', fila: 'ext_inferior', id: 'T03 S12', valor: -16.5, habilitado: true },
    { posicion: 101, columna: 'P1', fila: 'ext_inferior', id: 'A01',     valor: -21.5, habilitado: true },
    { posicion: 102, columna: 'P3', fila: 'ext_inferior', id: 'A02',     valor: -21.5, habilitado: true },
  ],
  4: [
    { posicion: 1,   columna: 'P1', fila: 'int_superior', id: 'T04 S01', valor: -25.1, habilitado: true },
    { posicion: 2,   columna: 'P1', fila: 'ext_superior', id: 'T04 S02', valor: -26.3, habilitado: true },
    { posicion: 3,   columna: 'P2', fila: 'int_superior', id: 'T04 S03', valor: -25.8, habilitado: true },
    { posicion: 4,   columna: 'P2', fila: 'ext_superior', id: 'T04 S04', valor: -26.0, habilitado: false },
    { posicion: 5,   columna: 'P3', fila: 'int_superior', id: 'T04 S05', valor: -25.4, habilitado: true },
    { posicion: 6,   columna: 'P3', fila: 'ext_superior', id: 'T04 S06', valor: -26.7, habilitado: true },
    { posicion: 7,   columna: 'P4', fila: 'int_superior', id: 'T04 S07', valor: -25.2, habilitado: true },
    { posicion: 8,   columna: 'P4', fila: 'ext_superior', id: 'T04 S08', valor: -26.9, habilitado: true },
    { posicion: 9,   columna: 'P5', fila: 'int_superior', id: 'T04 S09', valor: -25.6, habilitado: false },
    { posicion: 10,  columna: 'P5', fila: 'ext_superior', id: 'T04 S10', valor: -26.2, habilitado: true },
    { posicion: 11,  columna: 'P6', fila: 'int_superior', id: 'T04 S11', valor: -25.9, habilitado: true },
    { posicion: 12,  columna: 'P6', fila: 'ext_superior', id: 'T04 S12', valor: -26.5, habilitado: true },
    { posicion: 17,  columna: 'P1', fila: 'int_inferior', id: 'T04 S13', valor: -26.8, habilitado: true },
    { posicion: 18,  columna: 'P1', fila: 'ext_inferior', id: 'T04 S14', valor: -25.3, habilitado: true },
    { posicion: 19,  columna: 'P2', fila: 'int_inferior', id: 'T04 S15', valor: -26.1, habilitado: true },
    { posicion: 20,  columna: 'P2', fila: 'ext_inferior', id: 'T04 S16', valor: -25.7, habilitado: false },
    { posicion: 21,  columna: 'P3', fila: 'int_inferior', id: 'T04 S17', valor: -26.4, habilitado: true },
    { posicion: 22,  columna: 'P3', fila: 'ext_inferior', id: 'T04 S18', valor: -25.5, habilitado: true },
    { posicion: 23,  columna: 'P4', fila: 'int_inferior', id: 'T04 S19', valor: -26.6, habilitado: true },
    { posicion: 24,  columna: 'P4', fila: 'ext_inferior', id: 'T04 S20', valor: -25.0, habilitado: true },
    { posicion: 25,  columna: 'P5', fila: 'int_inferior', id: 'T04 S21', valor: -26.3, habilitado: false },
    { posicion: 26,  columna: 'P5', fila: 'ext_inferior', id: 'T04 S22', valor: -25.8, habilitado: true },
    { posicion: 27,  columna: 'P6', fila: 'int_inferior', id: 'T04 S23', valor: -26.0, habilitado: true },
    { posicion: 28,  columna: 'P6', fila: 'ext_inferior', id: 'T04 S24', valor: -25.4, habilitado: true },
    { posicion: 101, columna: 'P1', fila: 'ext_inferior', id: 'A01',     valor: -21.5, habilitado: true },
    { posicion: 102, columna: 'P6', fila: 'ext_inferior', id: 'A02',     valor: -21.5, habilitado: true },
  ],
  5: [],
}

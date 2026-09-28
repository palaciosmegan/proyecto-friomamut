import type { Ambiente } from '../config/ambientes.config'
import type { Sensor } from '../types/sensor.types'

// Túnel mock con la capacidad máxima del grid H:
// 40 posiciones en nivel 1 + 40 en nivel 2 (un sensor INT y uno EXT por palet) + sensores especiales 101–106.
// Solo se inyecta en desarrollo (ver RootDataProvider).

export const MOCK_TUNEL_ID = -1

export const MOCK_AMBIENTE: Ambiente = { id: MOCK_TUNEL_ID, label: 'MOCK A', imageVariant: 'H' }

const ESPECIALES: { id: string; posicion: number; valor: number }[] = [
  { id: 'A01', posicion: 101, valor: 0.6 },    // ambiente (°C)
  { id: 'A02', posicion: 102, valor: 3.9 },    // retorno (°C)
  { id: 'A03', posicion: 103, valor: 16.8 },   // presión palet der (mmca)
  { id: 'A04', posicion: 104, valor: 24.3 },   // presión ventilador (mmca)
  { id: 'A05', posicion: 105, valor: 38740 },  // caudal (m³/h)
  { id: 'A06', posicion: 106, valor: 17.2 },   // presión palet izq (mmca)
]

// Pseudoaleatorio determinista para que los valores no cambien entre recargas
function ruido(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Temperatura de pulpa durante el enfriamiento: el INT (centro del palet) va más caliente que el EXT
// (cara expuesta al aire frío) y el nivel 2 algo más caliente que el nivel 1.
function temperatura(posicion: number, nivel: number) {
  const esInt = posicion % 2 !== 0
  const base = esInt ? 4.2 : 1.6
  const rango = esInt ? 2.8 : 1.2
  const valor = base + ruido(posicion + nivel * 100) * rango + (nivel === 2 ? 0.6 : 0)
  return Number(valor.toFixed(1))
}

function crearSensor(id: string, posicion: number, valor: number | null, habilitado: boolean, nivel?: number): Sensor {
  // Impares → fila interior, pares → fila exterior (ver getGridPos en Tuneles.tsx). Los especiales van como EXT.
  const orientation = posicion > 100 || posicion % 2 === 0 ? 'EXT' : 'INT'
  return {
    sensorId: nivel === undefined ? posicion : nivel * 1000 + posicion,
    id,
    codigoLectura: id,
    registroAmbiente: MOCK_TUNEL_ID,
    environmentAbbreviation: 'MOCK',
    orientation,
    posicion,
    habilitado,
    valor,
    active: habilitado,
    unidad: '°C',
    // Sin nivel → el API lo mapea a 1 (ver obtenerSensores)
    ...(nivel !== undefined && { nivel }),
  }
}

const codigo = (n: number) => `TPM01S${String(n).padStart(2, '0')}`

export const MOCK_SENSORES: Sensor[] = [
  ...Array.from({ length: 40 }, (_, i) => {
    const posicion = i + 1
    // Casos puntuales: sonda desconectada (7), sonda en falla leyendo -127 (12) y sensor deshabilitado (20)
    const valor = posicion === 7 ? null : posicion === 12 ? -127 : temperatura(posicion, 1)
    return crearSensor(codigo(posicion), posicion, valor, posicion !== 20)
  }),
  // Nivel 2: mismas posiciones 1–40, códigos S41–S80
  ...Array.from({ length: 40 }, (_, i) => {
    const posicion = i + 1
    return crearSensor(codigo(posicion + 40), posicion, temperatura(posicion, 2), true, 2)
  }),
  ...ESPECIALES.map(e => crearSensor(e.id, e.posicion, e.valor, true)),
]

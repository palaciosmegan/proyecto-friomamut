export type Orientation = 'EXT' | 'INT'

export type Sensor = {
  sensorId?: number
  posicion: number
  orientation: Orientation
  id: string
  valor: number | null
  habilitado: boolean
}

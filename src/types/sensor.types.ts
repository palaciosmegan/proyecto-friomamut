export type Orientation = 'EXT' | 'INT'

export type Sensor = {
  sensorId?: number
  registroAmbiente: number
  registroAmbienteLectura?: number
  registroAmbienteEstructura?: number
  registroSensor?: number
  posicion: number
  orientation: Orientation
  id: string
  valor: number | null
  habilitado: boolean
}

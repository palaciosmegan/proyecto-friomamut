export type Orientation = 'EXT' | 'INT'

export type Sensor = {
  sensorId?: number
  id: string
  codigoLectura: string
  registroAmbiente: number
  registroAmbienteLectura?: number
  registroAmbienteEstructura?: number
  registroSensor?: number
  environmentAbbreviation: string
  orientation: Orientation
  posicion: number
  habilitado: boolean
  valor: number | null
  active: boolean // same as habilitado
  unidad: "°C"
}

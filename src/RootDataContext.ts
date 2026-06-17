import { createContext, useContext } from 'react'
import type { Ambiente } from './config/ambientes.config'
import type { Sensor } from './types/sensor.types'
import type { CalibratorOffsetMap } from './api/calibrador.api'
// import type { ApiBaliza } from './api/api.balizas'

export type RootDataContextType = {
  ambientes: Ambiente[]
  activeTab: number | null
  setActiveTab: (id: number) => void
  loaded: boolean
  sensoresMap: Record<number, Sensor[]>
  updateSensorHabilitado: (ambienteId: number, sensorId: string, habilitado: boolean) => void
  offsetsMap: CalibratorOffsetMap,
  updateOffset: (ambienteId: number, sensorCodigo: string, nuevoOffset: number) => void,
  refreshSensores: (ambienteId: number) => void,
  // balizas: ApiBaliza[]
}

export const RootDataContext = createContext<RootDataContextType | null>(null)

export function useRootData() {
  const ctx = useContext(RootDataContext)
  if (!ctx) throw new Error('useRootData must be used inside RootDataProvider')
  return ctx
}

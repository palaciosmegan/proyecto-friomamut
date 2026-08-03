import { createContext, useContext } from 'react'
import type { Ambiente } from './config/ambientes.config'
import type { Sensor } from './types/sensor.types'
import type { CalibratorOffsetMap } from './api/calibrador.api'
import type { ApiBaliza } from './api/api.balizas'
import type { ApiProcesoAmbiente } from './api/api.procesos'
import type { ApiErrorKind } from './api/api.errors'

export type RootDataContextType = {
  ambientes: Ambiente[]
  ambientesError: ApiErrorKind | null
  activeTab: number | null
  setActiveTab: (id: number) => void
  loaded: boolean
  sensoresMap: Record<number, Sensor[]>
  sensoresLoaded: Record<number, boolean>
  sensoresError: Record<number, ApiErrorKind | null>
  updateSensorHabilitado: (ambienteId: number, sensorId: string, habilitado: boolean) => void
  offsetsMap: CalibratorOffsetMap,
  updateOffset: (ambienteId: number, sensorCodigo: string, nuevoOffset: number) => void,
  refreshSensores: (ambienteId: number) => void,
  balizas: Record<number, ApiBaliza>
  balizasError: ApiErrorKind | null
  balizasLoaded: boolean
  refreshBalizas: () => Promise<void>
  procesosAmbiente: Record<number, ApiProcesoAmbiente>
}

export const RootDataContext = createContext<RootDataContextType | null>(null)

export function useRootData() {
  const ctx = useContext(RootDataContext)
  if (!ctx) throw new Error('useRootData must be used inside RootDataProvider')
  return ctx
}

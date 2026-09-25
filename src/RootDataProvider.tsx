import { useCallback, useEffect, useState } from 'react'
import { obtenerAmbientes } from './api/api.ambientes'
import { obtenerSensores } from './api/api.sensores'
import { obtenerOffsets, type CalibratorOffsetMap } from './api/api.calibrador'
import type { Ambiente } from './config/ambientes.config'
import { RootDataContext } from './RootDataContext'
import type { Sensor } from './types/sensor.types'
import { obtenerBalizas, type ApiBaliza } from './api/api.balizas'
import { obtenerProcesosAmbiente, type ApiProcesoAmbiente } from './api/api.procesos'
import { apiErrorKind, type ApiErrorKind } from './api/api.errors'

export function RootDataProvider({ children }: { children: React.ReactNode }) {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [ambientesError, setAmbientesError] = useState<ApiErrorKind | null>(null)
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [sensoresMap, setSensoresMap] = useState<Record<number, Sensor[]>>({})
  const [sensoresLoaded, setSensoresLoaded] = useState<Record<number, boolean>>({})
  const [sensoresError, setSensoresError] = useState<Record<number, ApiErrorKind | null>>({})
  const [offsetsMap, setOffsetsMap] = useState<CalibratorOffsetMap>({})
  const [balizas, setBalizas] = useState<Record<number, ApiBaliza>>({})
  const [balizasError, setBalizasError] = useState<ApiErrorKind | null>(null)
  const [balizasLoaded, setBalizasLoaded] = useState(false)
  const [procesosAmbiente, setProcesosAmbiente] = useState<Record<number, ApiProcesoAmbiente>>({})

  const refreshSensores = useCallback((ambienteId: number) => {
    return obtenerSensores(ambienteId)
      .then(data => {
        setSensoresMap(prev => ({ ...prev, [ambienteId]: data }))
        setSensoresError(prev => ({ ...prev, [ambienteId]: null }))
      })
      .catch(error => {
        console.error(`[API sensores] Fallo tunel ${ambienteId}:`, error)
        setSensoresError(prev => ({ ...prev, [ambienteId]: apiErrorKind(error) }))
      })
      .finally(() => setSensoresLoaded(prev => ({ ...prev, [ambienteId]: true })))
  }, [])

  useEffect(() => {
    obtenerAmbientes()
      .then(data => {
        setAmbientes(data)
        setAmbientesError(null)
        setActiveTab(current =>
          current !== null && data.some(a => a.id === current)
            ? current
            : (data[0]?.id ?? null)
        )
      })
      .catch(error => {
        console.error('[API tuneles] Fallo al cargar los tuneles:', error)
        if (error instanceof Error && error.cause) {
          console.error('[API tuneles] Causa original:', error.cause)
        }
        setAmbientesError(apiErrorKind(error))
      })
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (ambientes.length === 0) return
    ambientes.forEach(a => refreshSensores(a.id))
  }, [ambientes, refreshSensores])

  useEffect(() => {
    if (activeTab === null) return
    const interval = setInterval(() => refreshSensores(activeTab), 1_000)
    return () => clearInterval(interval)
  }, [activeTab, refreshSensores])

  useEffect(() => {
    obtenerOffsets()
      .then(setOffsetsMap)
      .catch(error => console.error('[API offsets] Fallo al cargar offsets:', error))
  }, [])

  const refreshBalizas = useCallback(() => {
    return obtenerBalizas()
      .then(data => {
        setBalizas(Object.fromEntries(data.map(b => [b.id, b])))
        setBalizasError(null)
      })
      .catch(error => {
        console.error('[API balizas] Fallo al cargar balizas:', error)
        setBalizasError(apiErrorKind(error))
      })
      .finally(() => setBalizasLoaded(true))
  }, [])

  useEffect(() => {
    refreshBalizas()
    const interval = setInterval(refreshBalizas, 1_000)
    return () => clearInterval(interval)
  }, [refreshBalizas])

  useEffect(() => {
    const fetchProcesosAmbiente = () => {
      obtenerProcesosAmbiente()
        .then(data => setProcesosAmbiente(Object.fromEntries(data.map(p => [p.tunel, p]))))
        .catch(error => console.error('[API procesos-ambiente] Fallo al cargar procesos-ambiente:', error))
    }
    fetchProcesosAmbiente()
    const interval = setInterval(fetchProcesosAmbiente, 1_000)
    return () => clearInterval(interval)
  }, [])

  const updateSensorHabilitado = useCallback((ambienteId: number, sensorId: string, habilitado: boolean) => {
    setSensoresMap(prev => ({
      ...prev,
      [ambienteId]: (prev[ambienteId] ?? []).map(s =>
        s.id === sensorId ? { ...s, habilitado } : s
      ),
    }))
  }, [])

  const updateOffset = useCallback((ambienteId: number, sensorCodigo: string, nuevoOffset: number) => {
    setOffsetsMap(prev => ({
      ...prev,
      [ambienteId]: {
        ...(prev[ambienteId] ?? {}),
        [sensorCodigo]: nuevoOffset,
      },
    }))
  }, [])

  return (
    <RootDataContext.Provider value={{
      ambientes,
      ambientesError,
      activeTab,
      setActiveTab,
      loaded,
      sensoresMap,
      sensoresLoaded,
      sensoresError,
      updateSensorHabilitado,
      offsetsMap,
      updateOffset,
      refreshSensores,
      balizas,
      balizasError,
      balizasLoaded,
      refreshBalizas,
      procesosAmbiente,
    }}>
      {children}
    </RootDataContext.Provider>
  )
}

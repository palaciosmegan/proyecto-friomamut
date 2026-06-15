import { useCallback, useEffect, useState } from 'react'
import { obtenerAmbientes } from './api/ambientes.api'
import { obtenerSensores } from './api/sensores.api'
import { obtenerOffsets, type CalibratorOffsetMap } from './api/calibrador.api'
import type { Ambiente } from './config/ambientes.config'
import { RootDataContext } from './RootDataContext'
import type { Sensor } from './types/sensor.types'

export function RootDataProvider({ children }: { children: React.ReactNode }) {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [sensoresMap, setSensoresMap] = useState<Record<number, Sensor[]>>({})
  const [offsetsMap, setOffsetsMap] = useState<CalibratorOffsetMap>({})

  useEffect(() => {
    obtenerAmbientes()
      .then(data => {
        setAmbientes(data)
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
      })
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (ambientes.length === 0) return
    ambientes.forEach(a => {
      obtenerSensores(a.id)
        .then(data => setSensoresMap(prev => ({ ...prev, [a.id]: data })))
        .catch(error => console.error(`[API sensores] Fallo al cargar tunel ${a.id}:`, error))
    })
  }, [ambientes])

  useEffect(() => {
    if (activeTab === null) return
    const interval = setInterval(() => {
      obtenerSensores(activeTab)
        .then(data => setSensoresMap(prev => ({ ...prev, [activeTab]: data })))
        .catch(error => console.error(`[API sensores] Fallo al polling tunel ${activeTab}:`, error))
    }, 10_000)
    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    obtenerOffsets()
      .then(setOffsetsMap)
      .catch(error => console.error('[API offsets] Fallo al cargar offsets:', error))
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

  const refreshSensores = useCallback((ambienteId: number) => {
    obtenerSensores(ambienteId)
      .then(data => setSensoresMap(prev => ({ ...prev, [ambienteId]: data })))
      .catch(error => console.error(`[API sensores] Fallo al refrescar tunel ${ambienteId}:`, error))
  }, [])

  return (
    <RootDataContext.Provider value={{
      ambientes,
      activeTab,
      setActiveTab,
      loaded,
      sensoresMap,
      updateSensorHabilitado,
      offsetsMap,
      updateOffset,
      refreshSensores,
    }}>
      {children}
    </RootDataContext.Provider>
  )
}
import { useCallback, useEffect, useState } from 'react'
import { obtenerAmbientes } from './api/ambientes.api'
import { obtenerSensores } from './api/sensores.api'
import type { Ambiente } from './config/ambientes.config'
import { RootDataContext } from './RootDataContext'
import type { Sensor } from './types/sensor.types'

export function RootDataProvider({ children }: { children: React.ReactNode }) {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [sensoresMap, setSensoresMap] = useState<Record<number, Sensor[]>>({})

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

  const updateSensorHabilitado = useCallback((ambienteId: number, sensorId: string, habilitado: boolean) => {
    setSensoresMap(prev => ({
      ...prev,
      [ambienteId]: (prev[ambienteId] ?? []).map(s => s.id === sensorId ? { ...s, habilitado } : s),
    }))
  }, [])

  return (
    <RootDataContext.Provider value={{ ambientes, activeTab, setActiveTab, loaded, sensoresMap, updateSensorHabilitado }}>
      {children}
    </RootDataContext.Provider>
  )
}

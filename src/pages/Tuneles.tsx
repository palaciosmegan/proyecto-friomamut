import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { actualizarSensorActivo } from '../api/sensores.api'
import type { Ambiente } from '../config/ambientes.config'
import { useRootData } from '../RootDataContext'
import type { Sensor } from '../types/sensor.types'
import { DataButton } from '../ui/DataButton'
import { Message } from '../ui/Message'
import { Nav } from '../ui/Nav'
import _imagenes from '../assets/imagenes_ambientes.json'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

const MIN_HEIGHT_VW = '43vw'

const DEFAULT_POSICIONES: Record<number, string> = {
  1: "5/9",
  2: "6/9",
  3: "5/8",
  4: "6/8",
  5: "5/7",
  6: "6/7",
  7: "5/6",
  8: "6/6",
  9: "5/5",
  10: "6/5",
  11: "5/4",
  12: "6/4",
  13: "5/3",
  14: "6/3",
  15: "5/2",
  16: "6/2",
  17: "3/9",
  18: "2/9",
  19: "3/8",
  20: "2/8",
  21: "3/7",
  22: "2/7",
  23: "3/6",
  24: "2/6",
  25: "3/5",
  26: "2/5",
  27: "3/4",
  28: "2/4",
  29: "3/3",
  30: "2/3",
  31: "3/2",
  32: "2/2",
  101: "4/10",
  102: "4/1",
  103: "2/10",
  104: "2/1",
  105: "6/1",
};

const G_POSICIONES: Record<number, string> = {
  1: "5/9",
  2: "6/9",
  3: "5/8",
  4: "6/8",
  5: "5/7",
  6: "6/7",
  7: "5/6",
  8: "6/6",
  9: "5/5",
  10: "6/5",
  11: "5/4",
  12: "6/4",
  13: "5/3",
  14: "6/3",
  15: "5/2",
  16: "6/2",
  17: "3/9",
  18: "2/9",
  19: "3/8",
  20: "2/8",
  21: "3/7",
  22: "2/7",
  23: "3/6",
  24: "2/6",
  25: "3/5",
  26: "2/5",
  27: "3/4",
  28: "2/4",
  29: "3/3",
  30: "2/3",
  31: "3/2",
  32: "2/2",
  101: "4/10",
  102: "4/2",
  103: "4/4",
  104: "4/8",
  105: "4/6",
};

const GRID_CONFIG: Record<string, { columns: string; rows: string; posiciones: Record<number, string> }> = {
  A: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  B: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  C: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  D: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  E: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  F: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  G: { columns: '7.6rem repeat(4, 1fr) 4rem repeat(4, 1fr) 7.5rem', rows: '4.7rem 1fr 1fr 3fr 1fr 1fr 4.7rem', posiciones: G_POSICIONES },
}

function getGridPos(posicion: number, posiciones: Record<number, string>) {
  const area = posiciones[posicion]
  if (!area) return {}
  const [row, col] = area.split('/')
  const alignTop = (posicion <= 16 && posicion % 2 === 0) || (posicion > 16 && posicion % 2 !== 0)
  return {
    gridRow: row,
    gridColumn: col,
    alignSelf: posicion > 100 ? 'center' : alignTop ? 'end' : 'start',
  }
}

function getUnidad(sensorId: string) {
  if (sensorId === 'A03' || sensorId === 'A04') return 'mmca'
  if (sensorId === 'A05') return 'm³/h'
  return '°C'
}

interface SensorPinProps {
  sensor: Sensor
  onToggle: (id: string) => void
}

const SensorPin = memo(({ sensor, onToggle }: SensorPinProps) => {
  const handleClick = useCallback(() => onToggle(sensor.id), [sensor.id, onToggle])
  return (
    <DataButton
      valor={sensor.posicion}
      id={sensor.id}
      unidad={getUnidad(sensor.id)}
      habilitado={sensor.habilitado === true}
      orientation={sensor.orientation}
      onToggle={handleClick}
    />
  )
})
SensorPin.displayName = 'SensorPin'

interface TunelesPanelProps {
  ambiente: Ambiente
  imageVariant: string
}

const TunelesPanel = memo(({ ambiente, imageVariant }: TunelesPanelProps) => {
  const { sensoresMap, updateSensorHabilitado } = useRootData()
  const sensores = useMemo(() => sensoresMap[ambiente.id] ?? [], [sensoresMap, ambiente.id])
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgHeight, setImgHeight] = useState<number | undefined>()

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const ro = new ResizeObserver(() => setImgHeight(img.clientHeight))
    ro.observe(img)
    return () => ro.disconnect()
  }, [])

  const handleToggle = useCallback((sensorId: string) => {
    const sensor = sensores.find(s => s.id === sensorId)
    if (!sensor) return
    if (sensor.sensorId === undefined) {
      console.error(`[API sensores] ${sensor.id} no tiene sensorId real y no puede actualizarse`)
      return
    }
    const nuevoEstado = !sensor.habilitado
    updateSensorHabilitado(ambiente.id, sensorId, nuevoEstado)
    actualizarSensorActivo(ambiente.id, sensor.sensorId, nuevoEstado).catch(error => {
      console.error(`[API sensores] Fallo al actualizar ${sensor.id}:`, error)
      updateSensorHabilitado(ambiente.id, sensorId, !nuevoEstado)
    })
  }, [sensores, ambiente.id, updateSensorHabilitado])

  const sensoresLoaded = ambiente.id in sensoresMap

  return (
    <div className="relative w-full h-full">
      <img
        ref={imgRef}
        src={imagenes.find((imagen) => imagen.variante === imageVariant)?.imagen}
        alt=""
        className={`rotate-180 w-full max-h-full object-fill`}
        style={{ minHeight: MIN_HEIGHT_VW }}
      />

      {sensoresLoaded && sensores.length === 0 ? (
        <Message />
      ) : (
        <div className="absolute inset-x-0 top-0" style={{ height: imgHeight ?? '100%' }}>
          <div
            className="grid h-full place-items-center items-stretch"
            style={{
              gridTemplateRows: GRID_CONFIG[imageVariant]?.rows,
              gridTemplateColumns: GRID_CONFIG[imageVariant]?.columns,
            }}
          >
            {sensores.map(s => (
              <div key={s.id} style={getGridPos(s.posicion, GRID_CONFIG[imageVariant]?.posiciones ?? DEFAULT_POSICIONES)}>
                <SensorPin sensor={s} onToggle={handleToggle} />
              </div>
            ))}

            {[
              { label: 'EXT', row: 2 },
              { label: 'INT', row: 3 },
              { label: 'INT', row: 5 },
              { label: 'EXT', row: 6 },
            ].map(({ label, row }, i) => (
              <div
                key={`orientation-label-${i}`}
                className="lg:hidden short:block text-xxs font-semibold text-white bg-[var(--color-deep)] border border-white/10 rounded px-1.5 py-0.5"
                style={{ gridRow: row, gridColumn: 10, alignSelf: 'center', justifySelf: 'start', marginLeft: '0.35rem' }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
TunelesPanel.displayName = 'TunelesPanel'

export function Tuneles() {
  const { ambientes, activeTab, setActiveTab, loaded } = useRootData()

  const ambientesConVariante = ambientes.map((a, i) => ({
    ...a,
    imageVariant: i === 0 ? 'G' : 'A',
  }))

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />

      <main className="flex-1 overflow-hidden pb-[30px] relative">
        {loaded && ambientesConVariante.length === 0 ? (
          <Message text="Sin tuneles configurados" />
        ) : ambientesConVariante.map(ambiente => (
          <div
            key={ambiente.id}
            className={`absolute inset-0 h-full${ambiente.id !== activeTab ? ' invisible' : ''}`}
          >
            <TunelesPanel
              ambiente={ambiente}
              imageVariant={ambiente.imageVariant}
            />
          </div>
        ))}
      </main>
    </div>
  )
}

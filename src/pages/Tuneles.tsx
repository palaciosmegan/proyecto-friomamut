import { memo, useCallback, useMemo } from 'react'
import { actualizarSensorActivo } from '../api/sensores.api'
import type { Ambiente } from '../config/ambientes.config'
import { useRootData } from '../RootDataContext'
import type { Sensor } from '../types/sensor.types'
import { Chip } from '../ui/Chip'
import { DataButton } from '../ui/DataButton'
import { Message } from '../ui/Message'
import { Nav } from '../ui/Nav'
import { Toast } from '../ui/Toast'
import { useCalibradorResponse } from '../hooks/useCalibradorResponse'
import _imagenes from '../assets/imagenes_ambientes.json'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

// const MIN_HEIGHT_VW = '43vw'

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
  104: "6/10",
  105: "6/1",
  106: "2/10"
};

const G_POSICIONES: Record<number, string> = {
  1: "5/2 / span 2",
  2: "6/2 / span 2",
  3: "6/4 / span 2",
  4: "5/4 / span 2",
  5: "6/6 / span 2",
  6: "5/6 / span 2",
  7: "5/8 / span 2",
  8: "6/8 / span 2",
  9: "3/2 / span 2",
  10: "2/2 / span 2",
  11: "3/4 / span 2",
  12: "2/4 / span 2",
  13: "3/6 / span 2",
  14: "2/6 / span 2",
  15: "3/8 / span 2",
  16: "2/8 / span 2",
  101: "4/9 / span 2",
  102: "4/1 / span 2",
  103: "4/4",
  104: "4/7 / span 2",
  105: "4/5 / span 2",
  106: "4/3",
};

const GRID_CONFIG: Record<string, { columns: string; rows: string; posiciones: Record<number, string> }> = {
  A: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  B: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  C: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  D: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  E: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  F: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  G: { columns: '1.2fr repeat(8, 1fr) 1.35fr', rows: '1fr 1fr 1fr 2.2fr 1fr 1fr 1fr', posiciones: G_POSICIONES },
}

function getGridPos(posicion: number, posiciones: Record<number, string>) {
  const area = posiciones[posicion]
  if (!area) return {}
  const slash = area.indexOf('/')
  const row = area.slice(0, slash)
  const col = area.slice(slash + 1)
  const alignTop = (posicion <= 16 && posicion % 2 === 0) || (posicion > 16 && posicion % 2 !== 0)
  return {
    gridRow: row,
    gridColumn: col,
    alignSelf: posicion > 100 ? 'center' : alignTop ? 'end' : 'start',
    justifySelf: col === '10' && posicion === 106 ? 'start' : col === '10' && posicion === 103 ? 'end' : undefined,
  }
}

function getUnidad(sensorId: string) {
  if (sensorId === 'A03' || sensorId === 'A04' || sensorId === 'A06') return 'mmca'
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
      valor={sensor.valor}
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
  const { response, toastKey, wrapFunction, clearMessage } = useCalibradorResponse()

  const handleToggle = useCallback((sensorId: string) => {
    const sensor = sensores.find(s => s.id === sensorId)
    if (!sensor || sensor.registroAmbienteEstructura === undefined || sensor.registroSensor === undefined) return
    const nuevoEstado = !sensor.habilitado
    updateSensorHabilitado(ambiente.id, sensorId, nuevoEstado)
    wrapFunction(async () => {
      await actualizarSensorActivo(sensor.registroAmbienteEstructura!, sensor.registroSensor!, nuevoEstado)
    }).catch(() => updateSensorHabilitado(ambiente.id, sensorId, !nuevoEstado))
  }, [sensores, ambiente.id, updateSensorHabilitado, wrapFunction])

  const sensoresLoaded = ambiente.id in sensoresMap

  return (
    <div className="relative w-full h-full">
      {response !== null && (
        <Toast key={toastKey} message={response.message} variant={response.ok ? 'success' : 'error'} callback={clearMessage} />
      )}
      <div
        className="grid w-full h-full place-items-center items-stretch"
        style={{
          gridTemplateRows: GRID_CONFIG[imageVariant]?.rows,
          gridTemplateColumns: GRID_CONFIG[imageVariant]?.columns,
        }}
      >
        <img
          src={imagenes.find((imagen) => imagen.variante === imageVariant)?.imagen}
          alt={imagenes.find((imagen) => imagen.variante === imageVariant)?.nombre}
          decoding='async'
          className='rotate-180 w-full h-full object-fill -z-1'
          style={{ gridRow: '1 / -1', gridColumn: '1 / -1' }}
        />

        {sensoresLoaded && sensores.length === 0 ? (
          <div className="place-self-center" style={{ gridRow: '1 / -1', gridColumn: '1 / -1' }}>
            <Message />
          </div>
        ) : (
          <>
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
                className="2xl:hidden short:block text-xs font-semibold text-white bg-[var(--color-deep)] border border-white/10 rounded px-1.5 py-0.5"
                style={{ gridRow: row, gridColumn: 10, alignSelf: 'center', justifySelf: 'start', marginLeft: '0.35rem' }}
              >
                {label}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
})
TunelesPanel.displayName = 'TunelesPanel'

export function Tuneles() {
  const { ambientes, activeTab, setActiveTab, loaded, procesosAmbiente } = useRootData()
  const processActive = activeTab !== null ? procesosAmbiente[activeTab]?.tieneProceso : undefined

  return (
    <div className="flex flex-col h-dvh overflow-hidden pt-4">
      <main className="flex-1 overflow-hidden pb-[30px] relative">
        {loaded && ambientes.length === 0 ? (
          <Message text="Sin tuneles configurados" />
        ) : ambientes.map(ambiente => ambiente.id === activeTab && (
          <div key={ambiente.id} className="absolute inset-0 h-full">
            <TunelesPanel
              ambiente={ambiente}
              imageVariant={ambiente.imageVariant ?? 'A'}
            />
          </div>
        ))}
        {activeTab !== null && (
          <div className="absolute top-4 left-4 z-10">
            <Chip
              label={processActive ? 'Proceso activo' : 'Sin proceso activo'}
              variant={processActive ? 'green' : 'gray'}
            />
          </div>
        )}
      </main>
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />
    </div>
  )
}

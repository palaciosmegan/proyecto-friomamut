import { memo, useCallback, useMemo } from 'react'
import { actualizarSensorActivo } from '../api/sensores.api'
import type { Ambiente } from '../config/ambientes.config'
import { useRootData } from '../RootDataContext'
import type { Sensor } from '../types/sensor.types'
import { Chip } from '../ui/Chip'
import { DataButton } from '../ui/DataButton'
import { NIVEL_BG } from '../config/niveles.config'
import { Legend } from '../ui/Legend'
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
  104: "2/1",
  105: "6/1",
  106: "6/10"
};

const G_POSICIONES: Record<number, string> = {
  1: "5/2 / span 2",
  2: "6/2 / span 2",
  3: "5/4 / span 2",
  4: "6/4 / span 2",
  5: "5/6 / span 2",
  6: "6/6 / span 2",
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

const H_POSICIONES: Record<number, string> = {
  1: "5/11",
  2: "6/11",
  3: "5/10",
  4: "6/10",
  5: "5/9",
  6: "6/9",
  7: "5/8",
  8: "6/8",
  9: "5/7",
  10: "6/7",
  11: "5/6",
  12: "6/6",
  13: "5/5",
  14: "6/5",
  15: "5/4",
  16: "6/4",
  17: "5/3",
  18: "6/3",
  19: "5/2",
  20: "6/2",
  21: "3/11",
  22: "2/11",
  23: "3/10",
  24: "2/10",
  25: "3/9",
  26: "2/9",
  27: "3/8",
  28: "2/8",
  29: "3/7",
  30: "2/7",
  31: "3/6",
  32: "2/6",
  33: "3/5",
  34: "2/5",
  35: "3/4",
  36: "2/4",
  37: "3/3",
  38: "2/3",
  39: "3/2",
  40: "2/2",
  // 100s mapeados en un flexbox
};

// Ajustes de estilo puntuales por posición, aplicados sobre la celda
const H_AJUSTES: Record<number, React.CSSProperties> = {
  101: { justifyContent: 'flex-end' },
  106: { marginTop: '-25px' },
};

const GRID_CONFIG: Record<string, { columns: string; rows: string; posiciones: Record<number, string>; ajustes?: Record<number, React.CSSProperties> }> = {
  A: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  B: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  C: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  D: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  E: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  F: { columns: '3.3fr repeat(8, 1fr) 2.7fr', rows: 'repeat(7, 1fr)', posiciones: DEFAULT_POSICIONES },
  G: { columns: '1.2fr repeat(8, 1fr) 1.35fr', rows: '1fr 1fr 1fr 2.2fr 1fr 1fr 1fr', posiciones: G_POSICIONES },
  H: { columns: '1.3fr repeat(10, 1fr) 0.7fr', rows: '0.45fr repeat(2, 1fr) 10px repeat(2, 1fr) 0.4fr', posiciones: H_POSICIONES, ajustes: H_AJUSTES },
}

const getSensorSelfAlign = (variant: string, posicion: number) => {
  if (posicion > 100) return 'center'
  switch (variant) {
    case 'A':
      if ((posicion <= 16 && posicion % 2 === 0) || (posicion > 16 && posicion % 2 !== 0)) return 'end';
      else return 'start';
  
    case 'G':
      if ((posicion <= 8 && posicion % 2 === 0) || (posicion > 8 && posicion % 2 !== 0)) return 'end';
      else return 'start';

    default:
      return 'center';
  }
}

// Separación con el borde de la celda, del lado opuesto a la otra posición. Se encoge a 0 si no hay espacio.
const MARGEN_CELDA = '10px'

const getGridPos = (posicion: number, imageVariant: string): React.CSSProperties => {
  const posiciones = GRID_CONFIG[imageVariant]?.posiciones ?? DEFAULT_POSICIONES
  const area = posiciones[posicion]
  if (!area) return {}
  const slash = area.indexOf('/')
  const row = area.slice(0, slash)
  const col = area.slice(slash + 1)
  return {
    gridRow: row,
    gridColumn: col,
    justifySelf: imageVariant !== 'G' && (posicion === 103 || posicion === 106) ? 'center' : undefined,
  }
}

interface CeldaSensoresProps {
  posicion: number
  sensores: Sensor[]
  imageVariant: string
  onToggle: (id: string) => void
}

// Todos los sensores (niveles) de una misma posición, juntos en la celda
const CeldaSensores = memo(({ posicion, sensores, imageVariant, onToggle }: CeldaSensoresProps) => {
  const align = getSensorSelfAlign(imageVariant, posicion)
  const spacer = align !== 'center' && <div style={{ flex: `0 1 ${MARGEN_CELDA}`, minHeight: 0 }} />
  return (
    <div
      className="flex flex-col gap-0.5 min-h-0"
      style={{
        ...getGridPos(posicion, imageVariant),
        alignSelf: 'stretch',
        justifyContent: align === 'end' ? 'flex-end' : align === 'start' ? 'flex-start' : 'center',
        ...GRID_CONFIG[imageVariant]?.ajustes?.[posicion],
      }}
    >
      {align === 'start' && spacer}
      {sensores.map(s => (
        <div key={s.id} className="shrink-0">
          <SensorPin sensor={s} onToggle={onToggle} imageVariant={imageVariant} />
        </div>
      ))}
      {align === 'end' && spacer}
    </div>
  )
})
CeldaSensores.displayName = 'CeldaSensores'

function getUnidad(sensorId: string) {
  if (sensorId === 'A03' || sensorId === 'A04' || sensorId === 'A06') return 'mmca'
  if (sensorId === 'A05') return 'm³/h'
  return '°C'
}

interface SensorPinProps {
  sensor: Sensor
  onToggle: (id: string) => void
  imageVariant: string
}

const SensorPin = memo(({ sensor, onToggle, imageVariant }: SensorPinProps) => {
  const handleClick = useCallback(() => onToggle(sensor.id), [sensor.id, onToggle])
  return (
    <DataButton
      valor={sensor.valor}
      id={sensor.id}
      unidad={getUnidad(sensor.id)}
      habilitado={sensor.habilitado === true}
      orientation={sensor.orientation}
      nivel={sensor.nivel}
      onToggle={handleClick}
      posicion={sensor.posicion}
      imageVariant={imageVariant}
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
  const hayNivel2 = useMemo(() => sensores.some(s => s.nivel === 2), [sensores])

  const ambientSensorsAreColumnStyle = imageVariant === 'H'
  const sensoresPorPosicion = useMemo(() => {
    const grupos = new Map<number, Sensor[]>()
    for (const s of sensores) grupos.set(s.posicion, [...(grupos.get(s.posicion) ?? []), s])
    for (const grupo of grupos.values()) grupo.sort((a, b) => (b.nivel ?? 1) - (a.nivel ?? 1))
    return [...grupos]
  }, [sensores])

  console.log(sensoresPorPosicion)

  const intExtLabel = (variant: string, row: number) => {
    const style = variant === 'H' ? { gridRow: row, gridColumn: 12, alignSelf: 'center', justifySelf: 'start' } : { gridRow: row, gridColumn: 10, alignSelf: 'center', justifySelf: 'start', marginLeft: '0.35rem' }
    return style
  }

  return (
    <div className="relative w-full h-full">
      {response !== null && (
        <Toast key={toastKey} message={response.message} variant={response.ok ? 'success' : 'error'} callback={clearMessage} />
      )}
      {hayNivel2 && (
        <div className="absolute top-1 right-55 z-10">
          <Legend items={[
            { label: 'Nivel 1', color: NIVEL_BG[1] },
            { label: 'Nivel 2', color: NIVEL_BG[2] },
          ]} />
        </div>
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
            {sensoresPorPosicion.filter(([posicion]) => !ambientSensorsAreColumnStyle || posicion < 100).map(([posicion, grupo]) => (
              <CeldaSensores
                key={posicion}
                posicion={posicion}
                sensores={grupo}
                imageVariant={imageVariant}
                onToggle={handleToggle}
              />
            ))}
            {ambientSensorsAreColumnStyle && (
              <div
                className="flex flex-col justify-evenly items-center min-h-0"
                style={{ gridColumn: 1, gridRow: '1 / -1', alignSelf: 'stretch' }}
              >
                {sensoresPorPosicion.filter(([posicion]) => posicion > 100).map(([posicion, grupo]) => (
                  <div key={posicion} className="shrink-0">
                    <SensorPin sensor={grupo[0]} onToggle={handleToggle} imageVariant={imageVariant} />
                  </div>
                ))}
              </div>
            )}
            {[
              { label: 'EXT', row: 2 },
              { label: 'INT', row: 3 },
              { label: 'INT', row: 5 },
              { label: 'EXT', row: 6 },
            ].map(({ label, row }, i) => (
              <div
                key={`orientation-label-${i}`}
                className="2xl:hidden short:block text-xs font-semibold text-white bg-[var(--color-deep)] border border-white/10 rounded px-1.5 py-0.5"
                style={intExtLabel(imageVariant, row)}
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
          <div className="absolute top-1 right-4 z-10">
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

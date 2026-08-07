import { useState, useCallback, useEffect, useRef } from 'react'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { RangeInputs, type RangeValue } from '../ui/RangeInputs'
import { NumberInput } from '../ui/NumberInput'
import { actualizarBaliza } from '../api/api.balizas'
import type { ApiBaliza, Semaforo } from '../api/api.balizas'
import { actualizarSetpoints } from '../api/api.setpoints'
import { obtenerDeadband, actualizarDeadband } from '../api/api.deadband'
import { obtenerUmbralSensorMalo, actualizarUmbralSensorMalo } from '../api/api.umbral-sensor-malo'
import { useCalibradorResponse } from '../hooks/useCalibradorResponse'
import { Toast } from '../ui/Toast'
import { StatusMessage } from '../ui/StatusMessage'
import clsx from 'clsx'
import { Chip } from '../ui/Chip'

type SemaforoStatus = Semaforo | 'none'

// Borrador local: cada fila (interno/externo) de cada grupo de setpoints es un
// rango {min,max}. null = sin tocar, se muestra el valor vigente del servidor.
type PendingRango = { interno: RangeValue | null; externo: RangeValue | null }

type PendingBaliza = {
  cambioFlujo: PendingRango
  finProceso: PendingRango
  pulpa: number | null
}

const EMPTY_RANGO: PendingRango = { interno: null, externo: null }
const EMPTY_PENDING: PendingBaliza = { cambioFlujo: EMPTY_RANGO, finProceso: EMPTY_RANGO, pulpa: null }

type FlagKey = keyof ApiBaliza['flags']

const FLAGS: { key: FlagKey; label: string }[] = [
  { key: 'cambioFlujo', label: 'Cambio de flujo' },
  { key: 'estadoPrevio', label: 'Estado previo' },
  { key: 'reanudado', label: 'Reanudado' },
]

const LIGHTS: { key: SemaforoStatus; color: string; shadow: string, instructivo: string }[] = [
  { key: 'rojo', color: '#ef4444', shadow: '0 0 10px 2px #ef444488', instructivo: 'Sensor INT llegó al objetivo' },
  { key: 'ambar', color: '#eab308', shadow: '0 0 10px 2px #eab30888', instructivo: 'Sensor EXT llegó al objetivo' },
  { key: 'verde', color: '#22c55e', shadow: '0 0 10px 2px #22c55e88', instructivo: 'Túnel tiene proceso activo' },
]

// Chip de flag: apagado (gris, sin relieve) por defecto; al activarse toma el color de la baliza del túnel.
function FlagBadge({ active, label, status }: { active: boolean; label: string; status: SemaforoStatus }) {
  const color = status !== 'none' ? LIGHTS.find(l => l.key === status)?.color : undefined

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold select-none border shadow-sm transition-colors',
        !(active && color) && 'bg-white/5 border-white/15 text-[var(--color-text-secondary)]',
      )}
      style={active && color ? { backgroundColor: `${color}26`, borderColor: `${color}99`, color } : undefined}
    >
      <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M3 1a1 1 0 0 1 1 1v.35l1.85-.4a5.5 5.5 0 0 1 3.4.3l.2.08a4 4 0 0 0 2.8.15l1.15-.35A.5.5 0 0 1 14 2.6v6.24a.5.5 0 0 1-.35.48l-.9.28a5.5 5.5 0 0 1-3.6-.2 4 4 0 0 0-2.9-.05L4 9.8V15a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1Z" />
      </svg>
      {label}
    </span>
  )
}

function Semaforo({ tunelLabel, status, onChange }: { tunelLabel: string; status: SemaforoStatus; onChange: (s: SemaforoStatus) => void }) {
  return (
    <div className="flex flex-col items-center self-start py-3 px-4 rounded-lg bg-[#0a0e1a] border border-[var(--color-border-subtle)] gap-4">
      {LIGHTS.map(({ key, color, shadow }) => {
        const active = status === key
        return (
          <button
            key={key}
            type="button"
            aria-label={`${tunelLabel}: forzar luz ${key}`}
            aria-pressed={active}
            className="w-10 h-10 rounded-full transition-all cursor-pointer active:scale-90"
            onClick={() => onChange(active ? 'none' : key)}
            style={{
              backgroundColor: active ? color : `${color}30`,
              boxShadow: active ? shadow : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

export function Balizas() {
  const { ambientes, activeTab, setActiveTab, balizas, balizasError, balizasLoaded, refreshBalizas } = useRootData()
  const [pending, setPending] = useState<Record<number, PendingBaliza>>({})
  const [instructivoOpen, setInstructivoOpen] = useState(false)
  const [loading, setLoading] = useState<{ id: number; msg: string } | null>(null)
  const instructivoCerrarRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!instructivoOpen) return
    instructivoCerrarRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInstructivoOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [instructivoOpen])

  const { response, toastKey, wrapFunction, clearMessage } = useCalibradorResponse()

  // Configuración global: dead-band y umbral de sensor malo. null = aún sin cargar del servidor.
  const [deadband, setDeadband] = useState<number | null>(null)
  const [deadbandInput, setDeadbandInput] = useState(0)
  const [umbral, setUmbral] = useState<number | null>(null)
  const [umbralInput, setUmbralInput] = useState(0)

  useEffect(() => {
    obtenerDeadband().then(v => { setDeadband(v); setDeadbandInput(v) }).catch(() => { })
    obtenerUmbralSensorMalo().then(v => { setUmbral(v); setUmbralInput(v) }).catch(() => { })
  }, [])

  const handleGuardarDeadband = useCallback(() => {
    wrapFunction(async () => {
      await actualizarDeadband(deadbandInput)
      setDeadband(deadbandInput)
    })
  }, [deadbandInput, wrapFunction])

  const handleGuardarUmbral = useCallback(() => {
    wrapFunction(async () => {
      await actualizarUmbralSensorMalo(umbralInput)
      setUmbral(umbralInput)
    })
  }, [umbralInput, wrapFunction])

  const getPending = (id: number): PendingBaliza =>
    pending[id] ?? EMPTY_PENDING

  const tieneCambios = (p: PendingBaliza): boolean =>
    p.cambioFlujo.interno !== null || p.cambioFlujo.externo !== null ||
    p.finProceso.interno !== null || p.finProceso.externo !== null ||
    p.pulpa !== null

  // Fija el rango interno/externo de un grupo de setpoints (cambio de flujo o fin de proceso) en el borrador.
  const setRango = useCallback((id: number, grupo: 'cambioFlujo' | 'finProceso', fila: 'interno' | 'externo', rango: RangeValue) => {
    setPending(prev => {
      const actual = prev[id] ?? EMPTY_PENDING
      return {
        ...prev,
        [id]: { ...actual, [grupo]: { ...actual[grupo], [fila]: rango } },
      }
    })
  }, [])

  const setPulpa = useCallback((id: number, pulpa: number) => {
    setPending(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_PENDING), pulpa },
    }))
  }, [])

  // Solo cambia el semáforo
  const handleSemaforoChange = useCallback((b: ApiBaliza, s: SemaforoStatus) => {
    setLoading({ id: b.id, msg: 'Cambiando el estado de las luces...' })
    wrapFunction(async () => {
      await actualizarBaliza({ id: b.id, status: s === 'none' ? null : s })
      await refreshBalizas()
    }).finally(() => setLoading(null))
  }, [refreshBalizas, wrapFunction])

  // Solo cambia los setpoints tocados en el borrador (cambio de flujo, fin de proceso y/o pulpa)
  const handleGuardar = useCallback((b: ApiBaliza, p: PendingBaliza) => {
    setLoading({ id: b.id, msg: 'Cambiando el objetivo de temperatura...' })
    wrapFunction(async () => {
      await actualizarSetpoints(b.id, {
        ...(p.cambioFlujo.interno || p.cambioFlujo.externo) && {
          cambio_flujo: {
            ...(p.cambioFlujo.interno && { interno: p.cambioFlujo.interno }),
            ...(p.cambioFlujo.externo && { externo: p.cambioFlujo.externo }),
          },
        },
        ...(p.finProceso.interno || p.finProceso.externo) && {
          fin_proceso: {
            ...(p.finProceso.interno && { interno: p.finProceso.interno }),
            ...(p.finProceso.externo && { externo: p.finProceso.externo }),
          },
        },
        ...(p.pulpa !== null && { pulpa: p.pulpa }),
      })
      await refreshBalizas()
      // Limpia el borrador tras refrescar, así el display salta directo al valor
      // fresco del servidor sin regresar al viejo. En fallo no se llega acá.
      setPending(prev => { const next = { ...prev }; delete next[b.id]; return next })
    }).finally(() => setLoading(null))
  }, [refreshBalizas, wrapFunction])

  const items = Object.values(balizas)

  return (
    <>
      <div className="balizas-page flex flex-col h-dvh overflow-hidden pt-4">
        <main className="relative flex-1 pb-[30px] overflow-y-auto">
          <section
            aria-labelledby="config-global-heading"
            className="bg-[var(--color-bg-panel)] border-b border-[var(--color-border-default)] px-6 py-4 flex flex-col gap-4 m-6 mb-0 rounded-xl"
          >
            <h2 id="config-global-heading" className="text-[1.2rem] font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
              CONFIGURACIÓN GLOBAL
            </h2>
            <div className="flex flex-col gap-5 md:flex-row justify-between">
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium tracking-wider uppercase text-[var(--color-text-primary)]">Dead-band (histéresis)</legend>
                <p className="text-[var(--color-text-secondary)]">
                  Extiende el rango <code>±valor</code> cuando el color ya está activo. Válido 0–5 °C.
                </p>
                <div className="flex items-center gap-3 justify-between">
                  <label htmlFor="deadband" className="sr-only">Valor de dead-band</label>
                  <div className="flex items-center gap-1">
                    <NumberInput
                      id="deadband"
                      value={deadbandInput}
                      step={0.1}
                      unit="°C"
                      onChange={v => setDeadbandInput(Math.min(5, Math.max(0, v)))}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={deadband === null || deadbandInput === deadband}
                    className="btn btn-primary"
                    onClick={handleGuardarDeadband}
                  >
                    Guardar
                  </button>
                </div>
              </fieldset>
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium tracking-wider uppercase text-[var(--color-text-primary)]">Umbral sensor malo</legend>
                <p className="text-[var(--color-text-secondary)]">
                  Sensores con <code>valor &gt;= umbral</code> se ignoran en toda evaluación.
                </p>
                <div className="flex items-center gap-3 justify-between">
                  <label htmlFor="umbral" className="sr-only">Valor de umbral de sensor malo</label>
                  <div className="flex items-center gap-1">
                    <NumberInput
                      id="umbral"
                      value={umbralInput}
                      step={1}
                      unit="°C"
                      onChange={v => setUmbralInput(Math.max(1, v))}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={umbral === null || umbralInput === umbral}
                    className="btn btn-primary"
                    onClick={handleGuardarUmbral}
                  >
                    Guardar
                  </button>
                </div>
              </fieldset>
            </div>
          </section>
          {ambientes.length !== 0 && items.length > 0 ? (
            <>
              {ambientes.map(a => {
                let b = items.find(b => b.id === a.id)
                b =
                  b ??
                  ({
                    id: a.id,
                    label: a.label,
                    status: null,
                    setpoints: {
                      cambio_flujo: {
                        interno: { min: 0, max: 0 },
                        externo: { min: 0, max: 0 },
                      },
                      fin_proceso: {
                        interno: { min: 0, max: 0 },
                        externo: { min: 0, max: 0 },
                      },
                      pulpa: 0,
                    },
                    flags: {
                      cambioFlujo: false,
                      estadoPrevio: false,
                      reanudado: false,
                    },
                  } as ApiBaliza);

                const p = getPending(b.id)
                const status = (b.status ?? 'none') as SemaforoStatus
                const cambioFlujoInterno = p.cambioFlujo.interno ?? b.setpoints.cambio_flujo.interno
                const cambioFlujoExterno = p.cambioFlujo.externo ?? b.setpoints.cambio_flujo.externo
                const finProcesoInterno = p.finProceso.interno ?? b.setpoints.fin_proceso.interno
                const finProcesoExterno = p.finProceso.externo ?? b.setpoints.fin_proceso.externo
                const pulpaValue = p.pulpa ?? b.setpoints.pulpa

                return (
                  <div key={b.id} className={clsx(a.id === activeTab ? '' : 'hidden', 'flex flex-col md:flex-row gap-4 p-6')}>
                    <div
                      className="flex flex-col gap-4 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] p-5 shadow-sm"
                    >
                      {/* overlay */}
                      {loading?.id === b.id && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-black/60">
                          <span className="px-3 text-center text-sm font-semibold text-[var(--color-text-primary)]">{loading.msg}</span>
                        </div>
                      )}
                      <h1 className="text-lg font-bold uppercase tracking-wider text-[var(--color-blue-soft)] mb-3">
                        {b.label}
                      </h1>
                      <div className="mb-6">
                      {b.processActive ? (
                        <Chip label="PROCESO ACTIVO" variant="green" />
                      ) : (
                        <Chip
                          label="APAGADO"
                          variant="gray"
                        />
                      )}
                      </div>
                      <div className="flex flex-1 flex-row gap-6">

                        <Semaforo
                          tunelLabel={b.label}
                          status={status}
                          onChange={s => handleSemaforoChange(b, s)}
                        />

                        <div className="flex flex-col justify-between pt-2 pb-8">
                          {FLAGS.map(f => (
                            <FlagBadge key={f.key} active={b.flags[f.key]} label={f.label} status={status} />
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="flex-1 border border-[var(--color-border-default)] rounded-xl bg-[var(--color-bg-panel)] p-5 shadow-sm flex flex-col gap-4 bg-[#10293f]">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border-subtle)] p-3">
                          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                            CAMBIO DE FLUJO
                          </h2>
                          <RangeInputs
                            idPrefix={`baliza-${b.id}-cambio-flujo`}
                            rows={[
                              { key: 'interno', label: 'INT', value: cambioFlujoInterno },
                              { key: 'externo', label: 'EXT', value: cambioFlujoExterno },
                            ]}
                            onChange={(fila, bound, v) => {
                              const base = fila === 'interno' ? cambioFlujoInterno : cambioFlujoExterno
                              setRango(b.id, 'cambioFlujo', fila as 'interno' | 'externo', { ...base, [bound]: v })
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border-subtle)] p-3">
                          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                            FIN DE PROCESO
                          </h2>
                          <RangeInputs
                            idPrefix={`baliza-${b.id}-fin-proceso`}
                            rows={[
                              { key: 'interno', label: 'INT', value: finProcesoInterno },
                              { key: 'externo', label: 'EXT', value: finProcesoExterno },
                            ]}
                            onChange={(fila, bound, v) => {
                              const base = fila === 'interno' ? finProcesoInterno : finProcesoExterno
                              setRango(b.id, 'finProceso', fila as 'interno' | 'externo', { ...base, [bound]: v })
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border-subtle)] p-3">
                          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                            ALARMA DE PULPA
                          </h2>
                          <div className="flex items-center justify-center gap-1">
                            <NumberInput
                              id={`baliza-${b.id}-pulpa`}
                              value={pulpaValue}
                              step={0.5}
                              unit="°C"
                              onChange={v => setPulpa(b.id, v)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end mt-4 short:mt-1.5">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setPending(prev => { const next = { ...prev }; delete next[b.id]; return next })}
                          disabled={!tieneCambios(p)}
                        >
                          Borrar cambios
                        </button>
                        <button
                          type="button"
                          disabled={!tieneCambios(p)}
                          className="btn btn-primary"
                          onClick={() => handleGuardar(b, p)}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <StatusMessage
              loaded={balizasLoaded}
              error={balizasError}
              labels={{
                fetch: 'No se pudo conectar con el servidor de balizas',
                format: 'La respuesta de balizas tiene un formato inesperado',
                empty: 'Sin balizas configuradas',
              }}
            />
          )}
          <button
            type="button"
            onClick={() => setInstructivoOpen(o => !o)}
            className="btn btn-secondary hidden"
          >
            Instructivo
          </button>
        </main>
        {instructivoOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="instructivo-heading"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
            <div
              className="flex flex-col gap-5 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-abyss)] p-6 shadow-xl w-80">
              <div className="flex items-center justify-between">
                <h2 id="instructivo-heading" className="text-base font-semibold text-[var(--color-text-primary)]">Instructivo</h2>
                <button
                  ref={instructivoCerrarRef}
                  type="button"
                  onClick={() => setInstructivoOpen(false)}
                  aria-label="Cerrar"
                  className="flex items-center justify-center w-9 h-9 rounded-sm p-5 bg-white/10 border border-[var(--color-border-default)] text-2xl leading-none text-[var(--color-text-secondary)] cursor-pointer"
                >
                  ✕
                </button>
              </div>
              {LIGHTS.map(({ key, color, shadow, instructivo }) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 shrink-0 rounded-full"
                    style={{ backgroundColor: color, boxShadow: shadow }}
                  />
                  <p className="text-sm text-[var(--color-text-secondary)]">{instructivo}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />
      </div>
      {response !== null && (
        <Toast
          key={toastKey}
          message={response.message}
          variant={response.ok ? 'success' : 'error'}
          callback={clearMessage}
        />
      )}
    </>
  )
}

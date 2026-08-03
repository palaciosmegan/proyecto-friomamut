import { useState, useCallback } from 'react'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { NumberInput } from '../ui/NumberInput'
import { actualizarBaliza } from '../api/api.balizas'
import type { ApiBaliza, Semaforo } from '../api/api.balizas'
import { useCalibradorResponse } from '../hooks/useCalibradorResponse'
import { Toast } from '../ui/Toast'
import { StatusMessage } from '../ui/StatusMessage'

type SemaforoStatus = Semaforo | 'none'

type PendingBaliza = {
  int: number | null
  ext: number | null
}

const EMPTY_PENDING: PendingBaliza = { int: null, ext: null }

const LIGHTS: { key: SemaforoStatus; color: string; shadow: string, instructivo: string }[] = [
  { key: 'rojo', color: '#ef4444', shadow: '0 0 10px 2px #ef444488', instructivo: 'Sensor INT llegó al objetivo' },
  { key: 'ambar', color: '#eab308', shadow: '0 0 10px 2px #eab30888', instructivo: 'Sensor EXT llegó al objetivo' },
  { key: 'verde', color: '#22c55e', shadow: '0 0 10px 2px #22c55e88', instructivo: 'Túnel tiene proceso activo' },
]

function Semaforo({ status, onChange }: { status: SemaforoStatus; onChange: (s: SemaforoStatus) => void }) {
  return (
    <div className="flex flex-col items-center justify-around h-full py-2 px-3 rounded-lg bg-[#0a0e1a] border border-[var(--color-border-subtle)] gap-3">
      {LIGHTS.map(({ key, color, shadow }) => {
        const active = status === key
        return (
          <button
            key={key}
            type="button"
            className="w-6 h-6 rounded-full transition-all cursor-pointer active:scale-90"
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
  const { ambientes, activeTab, setActiveTab, balizas, balizasError, balizasLoaded, refreshBalizas, procesosAmbiente } = useRootData()
  const [pending, setPending] = useState<Record<number, PendingBaliza>>({})
  const [instructivoOpen, setInstructivoOpen] = useState(false)
  const [loading, setLoading] = useState<{ id: number; msg: string } | null>(null)

  const { response, toastKey, wrapFunction, clearMessage } = useCalibradorResponse()

  const getPending = (id: number): PendingBaliza =>
    pending[id] ?? EMPTY_PENDING

  const updatePending = useCallback((id: number, patch: Partial<PendingBaliza>) => {
    setPending(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_PENDING), ...patch }
    }))
  }, [])

  // Solo cambia el semáforo
  const handleSemaforoChange = useCallback((b: ApiBaliza, s: SemaforoStatus) => {
    setLoading({ id: b.id, msg: 'Cambiando el estado de las luces...' })
    wrapFunction(async () => {
      await actualizarBaliza({ id: b.id, int: b.int, ext: b.ext, status: s === 'none' ? null : s })
      await refreshBalizas()
    }).finally(() => setLoading(null))
  }, [refreshBalizas, wrapFunction])

  // Solo cambia int/ext
  const handleGuardar = useCallback((b: ApiBaliza, int: number | null, ext: number | null) => {
    setLoading({ id: b.id, msg: 'Cambiando el objetivo de temperatura...' })
    wrapFunction(async () => {
      await actualizarBaliza({ id: b.id, int, ext, status: b.status ?? null })
      await refreshBalizas()
      // Limpia el borrador tras refrescar, así el display salta directo al valor
      // fresco del servidor sin regresar al viejo. En fallo no se llega acá.
      setPending(prev => { const next = { ...prev }; delete next[b.id]; return next })
    }).finally(() => setLoading(null))
  }, [refreshBalizas, wrapFunction])

  const items = Object.values(balizas)

  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden pt-4">
        <main className="relative flex-1 pb-[30px] overflow-y-auto">
          {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
            {items.map(b => {
              const p = getPending(b.id)
              const status = (b.status ?? 'none') as SemaforoStatus
              const int = p.int ?? b.int ?? 0
              const ext = p.ext ?? b.ext ?? 0

              return (
                <div
                  key={b.id}
                  className="relative flex flex-row gap-4 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] p-5 shadow-sm"
                >
                  {loading?.id === b.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-black/60">
                      <span className="px-3 text-center text-sm font-semibold text-[var(--color-text-primary)]">{loading.msg}</span>
                    </div>
                  )}
                  <Semaforo
                    status={status}
                    onChange={s => handleSemaforoChange(b, s)}
                  />

                  <div className="flex flex-col gap-4 flex-1">
                    <div className='flex justify-between items-center'>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                        {b.label}
                      </h3>
                      <p className='text-s tracking-wider'> {procesosAmbiente[b.id]?.tieneProceso ? 'PROCESO ACTIVO' : 'SIN PROCESO ACTIVO'}</p>
                    </div>

                    <div className="grid grid-cols-[20%_auto_3fr_auto] items-center justify-between gap-2">
                      <span className="text-xs text-[var(--color-text-secondary)]">INT</span>
                      <NumberInput
                        id={`baliza-${b.id}-int`}
                        value={int}
                        unit="°C"
                        onChange={val => updatePending(b.id, { int: val })}
                      />
                    </div>

                    <div className="grid grid-cols-[20%_auto_3fr_auto] items-center justify-between gap-2">
                      <span className="text-xs text-[var(--color-text-secondary)]">EXT</span>
                      <NumberInput
                        id={`baliza-${b.id}-ext`}
                        value={ext}
                        unit="°C"
                        onChange={val => updatePending(b.id, { ext: val })}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={(p.int === null || p.int === b.int) && (p.ext === null || p.ext === b.ext)}
                      className="btn btn-primary w-full mt-auto"
                      onClick={() => handleGuardar(b, p.int ?? b.int, p.ext ?? b.ext)}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
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
        </main>
        <button
          type="button"
          onClick={() => setInstructivoOpen(o => !o)}
          className="btn btn-secondary fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          Instructivo
        </button>
        {instructivoOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
            <div
              className="flex flex-col gap-5 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-abyss)] p-6 shadow-xl w-80">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-[var(--color-text-primary)]">Instructivo</h4>
                <button
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
        <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} hideTabs />
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

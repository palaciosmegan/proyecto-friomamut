import { useState, useCallback } from 'react'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { NumberInput } from '../ui/NumberInput'
import { actualizarBaliza } from '../api/api.balizas'
import type { Semaforo } from '../api/api.balizas'

type SemaforoStatus = Semaforo | 'none'

type PendingBaliza = {
  int: number | null
  ext: number | null
  status: SemaforoStatus | null
}

const LIGHTS: { key: SemaforoStatus; color: string; shadow: string }[] = [
  { key: 'rojo', color: '#ef4444', shadow: '0 0 10px 2px #ef444488' },
  { key: 'amarillo', color: '#eab308', shadow: '0 0 10px 2px #eab30888' },
  { key: 'verde', color: '#22c55e', shadow: '0 0 10px 2px #22c55e88' },
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
  const { ambientes, activeTab, setActiveTab, balizas } = useRootData()
  const [pending, setPending] = useState<Record<number, PendingBaliza>>({})

  const getPending = (id: number): PendingBaliza =>
    pending[id] ?? { int: null, ext: null, status: null }

  const updatePending = useCallback((id: number, patch: Partial<PendingBaliza>) => {
    setPending(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? { int: null, ext: null, status: null }), ...patch }
    }))
  }, [])

  return (
    <div className="flex flex-col h-dvh">
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} hideTabs />

      <main className="flex-1 pb-[30px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {Object.values(balizas).map(b => {
            const p = getPending(b.id)
            const status = (p.status ?? b.status ?? 'none') as SemaforoStatus
            const int = p.int ?? b.int ?? 0
            const ext = p.ext ?? b.ext ?? 0

            return (
              <div
                key={b.id}
                className="flex flex-row gap-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] p-5 shadow-sm"
              >
                <Semaforo
                  status={status}
                  onChange={s => updatePending(b.id, { status: s })}
                />

                <div className="flex flex-col gap-4 flex-1">
                  <div className='flex justify-between items-center'>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                      {b.label}
                    </h3>
                    <p className='text-s tracking-wider'> {b.processActive ? 'PROCESO ACTIVO' : 'SIN PROCESO ACTIVO'}</p>
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
                    disabled={!int}
                    className="btn btn-primary w-full mt-auto"
                    onClick={() => actualizarBaliza({
                      id: b.id,
                      int,
                      ext,
                      status: status === 'none' ? null : status,
                    })}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

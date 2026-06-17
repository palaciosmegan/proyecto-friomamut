import { useState, useCallback } from 'react'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { NumberInput } from '../ui/NumberInput'
import { actualizarBaliza } from '../api/api.balizas'

type SemaforoStatus = 'rojo' | 'amarillo' | 'verde' | 'none'

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

type BalizaState = {
  int: number | null
  ext: number | null
  status: SemaforoStatus | null
}

export function Balizas() {
  const { ambientes, activeTab, setActiveTab } = useRootData()
  const [balizas, setBalizas] = useState<Record<number, BalizaState>>({})

  const getBaliza = (id: number): BalizaState =>
    balizas[id] ?? { int: null, ext: null, status: null }

  const updateBalizas = useCallback((id: number, int: number | null, ext: number | null, status: SemaforoStatus | null) => {
    setBalizas(prev => ({
      ...prev,
      [id]: {
        int: int ?? prev[id]?.int ?? null,
        ext: ext ?? prev[id]?.ext ?? null,
        status: status ?? prev[id]?.status ?? null,
      }
    }))
  }, [])

  return (
    <div className="flex flex-col h-dvh">
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} hideTabs />

      <main className="flex-1 pb-[30px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {ambientes.map(a => (
            <div
              key={a.id}
              className="flex flex-row gap-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] p-5 shadow-sm"
            >
              <Semaforo
                status={getBaliza(a.id).status ?? 'none'}
                onChange={s => updateBalizas(a.id, null, null, s)}
              />

              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                  {a.label}
                </h3>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">Input A</span>
                  <NumberInput
                    id={`baliza-${a.id}-int`}
                    value={getBaliza(a.id).int ?? 0}
                    unit="°C"
                    onChange={val => updateBalizas(a.id, val, null, null)}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">Input B</span>
                  <NumberInput
                    id={`baliza-${a.id}-ext`}
                    value={getBaliza(a.id).ext ?? 0}
                    unit="°C"
                    onChange={val => updateBalizas(a.id, null, val, null)}
                  />
                </div>
                <button
                  type="button"
                  disabled={!getBaliza(a.id).int}
                  className="btn btn-primary w-full mt-auto"
                  onClick={() => {
                    const b = getBaliza(a.id)
                    actualizarBaliza({ id: a.id, int: b.int, ext: b.ext, status: b.status === 'none' ? null : b.status ?? null })
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

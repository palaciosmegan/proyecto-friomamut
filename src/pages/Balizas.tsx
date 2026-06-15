import { useState } from 'react'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { NumberInput } from '../ui/NumberInput'

type SemaforoStatus = 'red' | 'yellow' | 'green' | 'none'

const LIGHTS: { key: SemaforoStatus; color: string; shadow: string }[] = [
  { key: 'red', color: '#ef4444', shadow: '0 0 10px 2px #ef444488' },
  { key: 'yellow', color: '#eab308', shadow: '0 0 10px 2px #eab30888' },
  { key: 'green', color: '#22c55e', shadow: '0 0 10px 2px #22c55e88' },
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
  const { ambientes, activeTab, setActiveTab } = useRootData()
  const [valueA, setValueA] = useState<Record<number, number>>({})
  const [valueB, setValueB] = useState<Record<number, number>>({})
  const [statuses, setStatuses] = useState<Record<number, SemaforoStatus>>({})

  const handleChangeA = (id: number, value: number) =>
    setValueA(prev => ({ ...prev, [id]: value }))

  const handleChangeB = (id: number, value: number) =>
    setValueB(prev => ({ ...prev, [id]: value }))

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
                status={statuses[a.id] ?? 'none'}
                onChange={s => setStatuses(prev => ({ ...prev, [a.id]: s }))}
              />

              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
                  {a.label}
                </h3>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">Input A</span>
                  <NumberInput
                    id={`baliza-${a.id}`}
                    value={valueA[a.id] ?? 0}
                    unit="°C"
                    onChange={val => handleChangeA(a.id, val)}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">Input B</span>
                  <NumberInput
                    id={`baliza-${a.id}`}
                    value={valueB[a.id] ?? 0}
                    unit="°C"
                    onChange={val => handleChangeB(a.id, val)}
                  />
                </div>
                <button
                  type="button"
                  disabled={valueA[a.id] === undefined || valueA[a.id] === 0}
                  className="btn btn-primary w-full mt-auto"
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

import { useState } from 'react'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { NumberInput } from '../ui/NumberInput'

export function Balizas() {
  const { ambientes, activeTab, setActiveTab } = useRootData()
  const [corrections, setCorrections] = useState<Record<string, string>>({})

  const handleCorrectionChange = (id: string, value: string) => {
    setCorrections(current => ({ ...current, [id]: value }))
  }

  return (
    <div className="flex flex-col h-dvh">
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />

      <main className="flex-1 pb-[30px] relative">
        <h1>asdfg</h1>

        {ambientes.map(a => (
          <div
            key={a.id}
            className='bg-gray-800 w-100 h-50'
          // className={clsx(a.id !== activeTab && 'hidden')}
          >
            <h3>{a.label}</h3>
            <NumberInput sensorId={`baliza-${a.id}`}
              correction={corrections[`baliza-${a.id}`] ?? ''}
              onCorrectionChange={handleCorrectionChange}
              unidad={'°C'} />
            <button className='btn btn-secondary'>Guardar</button>
            
          </div>
        ))}
      </main>
    </div>
  )
}

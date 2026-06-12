import clsx from 'clsx'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { Calibrador, type CalibradorHandle } from '../ui/Calibrador'
import { useRef } from 'react'

export function Calibradores() {
  const { ambientes, activeTab, setActiveTab } = useRootData()
  
	const refs = useRef<Record<number, CalibradorHandle | null>>({})

  return (
    <div className="flex flex-col h-dvh">
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />

			<main className="flex-1 pb-[30px] relative">
				{ambientes.map(a => (
					<div
						key={a.id}
						className={clsx(a.id !== activeTab && 'hidden')}
					>
						<Calibrador
							ref={el => { refs.current[a.id] = el }}
							ambienteId={a.id}
							isActive={a.id === activeTab}
						/>
					</div>
				))}
			</main>
    </div>
  )
}

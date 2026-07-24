import clsx from 'clsx'
import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'
import { Calibrador } from '../ui/Calibrador'

export function Calibradores() {
  const { ambientes, activeTab, setActiveTab } = useRootData()
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden pt-4">
			<main className="flex-1 min-h-0 overflow-hidden pb-[30px] relative">
				{ambientes.map(a => (
					<div
						key={a.id}
						className={clsx('h-full', a.id !== activeTab && 'hidden')}
					>
						<Calibrador
							ambienteId={a.id}
							isActive={a.id === activeTab}
						/>
					</div>
				))}
			</main>

      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />
    </div>
  )
}

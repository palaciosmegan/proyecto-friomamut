import { useState } from 'react'
import { Nav } from './ui/Nav'
import { Diagram } from './ui/Diagram'
import { AMBIENTES } from './config/ambientes.config'

export const Viewer = () => {
	const [activeTab, setActiveTab] = useState(AMBIENTES[0].id)

	return (
		<div className="flex flex-col h-dvh overflow-hidden">
			<Nav
				TABS={AMBIENTES}
				activeId={activeTab}
				onSelect={setActiveTab}
			/>

			<main className="flex-1 overflow-hidden pb-[30px] relative">
				{AMBIENTES.map(a => (
					<div
						key={a.id}
						className={`absolute inset-0 h-full${a.id !== activeTab ? ' invisible' : ''}`}
					>
						<Diagram
							ambienteId={a.id}
							image={a.image}
							isActive={a.id === activeTab}
						/>
					</div>
				))}
			</main>
		</div>
	)
}

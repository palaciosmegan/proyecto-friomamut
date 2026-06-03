import { useState } from 'react'
import { Nav } from './ui/Nav'
import { AMBIENTES } from './config/ambientes.config'

export const Viewer = () => {
	const [activeTab, setActiveTab] = useState(AMBIENTES[0].id)

	return (
		<div className="w-min-[1200px] w-full h-[800px] flex flex-col overflow-hidden">
			<Nav
				TABS={AMBIENTES}
				activeId={activeTab}
				onSelect={setActiveTab}
			/>

			<main className="flex-1 overflow-hidden">
				{AMBIENTES.map(a => (
					<div
						key={a.id}
						className={a.id === activeTab ? 'block h-full' : 'hidden'}
					>
						{a.content}
					</div>
				))}
			</main>
		</div>
	)
}
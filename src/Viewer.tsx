import { useState } from 'react'
import { Nav } from './ui/Nav'
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

			<main className="flex-1 overflow-hidden pb-[30px]">
				{AMBIENTES.map(a => (
					<div
						key={a.id}
						className={a.id === activeTab ? 'h-full' : 'hidden'}
					>
						{a.content}
					</div>
				))}
			</main>
		</div>
	)
}
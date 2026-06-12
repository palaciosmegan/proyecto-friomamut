import { useEffect, useState } from 'react'
import { obtenerAmbientes } from './api/ambientes.api'
import _imagenes from './assets/imagenes_ambientes.json'
import { AMBIENTES } from './config/ambientes.config'
import { Diagram } from './ui/Diagram'
import { Nav } from './ui/Nav'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

export const Viewer = () => {
	const [ambientes, setAmbientes] = useState(AMBIENTES)
	const [activeTab, setActiveTab] = useState(AMBIENTES[0].id)

	useEffect(() => {
		obtenerAmbientes()
			.then(data => {
				if (data.length === 0) return

				setAmbientes(data)
				setActiveTab(current =>
					data.some(ambiente => ambiente.id === current) ? current : data[0].id
				)
			})
			.catch(error => {
				console.error('[API tuneles] Fallo al cargar los tuneles:', error)
				if (error instanceof Error && error.cause) {
					console.error('[API tuneles] Causa original:', error.cause)
				}
				console.info('[API tuneles] Se usaran los tuneles locales:', AMBIENTES)
			})
	}, [])

	return (
		<div className="flex flex-col h-dvh overflow-hidden">
			<Nav
				TABS={ambientes}
				activeId={activeTab}
				onSelect={setActiveTab}
			/>

			<main className="flex-1 overflow-hidden pb-[30px]">
				{ambientes.map(ambiente => (
					<div
						key={ambiente.id}
						className={ambiente.id === activeTab ? 'h-full' : 'hidden'}
					>
						<Diagram ambienteId={ambiente.id} image={imagenes[0].imagen} />
					</div>
				))}
			</main>
		</div>
	)
}

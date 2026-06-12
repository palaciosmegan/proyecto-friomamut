import { useEffect, useState } from 'react'
import { obtenerAmbientes } from './api/ambientes.api'
import _imagenes from './assets/imagenes_ambientes.json'
import type { Ambiente } from './config/ambientes.config'
import { Diagram } from './ui/Diagram'
import { Message } from './ui/Message'
import { Nav } from './ui/Nav'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

export const Viewer = () => {
	const [ambientes, setAmbientes] = useState<Ambiente[]>([])
	const [activeTab, setActiveTab] = useState<number | null>(null)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		obtenerAmbientes()
			.then(data => {
				setAmbientes(data)
				setActiveTab(current =>
					current !== null && data.some(ambiente => ambiente.id === current)
						? current
						: (data[0]?.id ?? null)
				)
			})
			.catch(error => {
				console.error('[API tuneles] Fallo al cargar los tuneles:', error)
				if (error instanceof Error && error.cause) {
					console.error('[API tuneles] Causa original:', error.cause)
				}
			})
			.finally(() => setLoaded(true))
	}, [])

	return (
		<div className="flex flex-col h-dvh overflow-hidden">
			<Nav
				TABS={ambientes}
				activeId={activeTab}
				onSelect={setActiveTab}
			/>

			<main className="flex-1 overflow-hidden pb-[30px] relative">
				{loaded && ambientes.length === 0 ? (
					<Message text="Sin tuneles configurados" />
				) : ambientes.map(ambiente => (
					<div
						key={ambiente.id}
						className={`absolute inset-0 h-full${ambiente.id !== activeTab ? ' invisible' : ''}`}
					>
						<Diagram
							ambienteId={ambiente.id}
							image={ambiente.image ?? imagenes[0].imagen}
							isActive={ambiente.id === activeTab}
						/>
					</div>
				))}
			</main>
		</div>
	)
}

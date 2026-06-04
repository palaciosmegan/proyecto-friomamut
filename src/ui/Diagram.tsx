import { useState, useCallback, memo, useMemo } from 'react'
import { MOCK_SENSORES, type SensorMock, type Fila } from '../mock-data/sensores.mock'
import { DataButton } from './DataButton'
import { Message } from './Message'

interface DiagramProps {
	title: string
	image: string
	ambienteId: number
}

const FILA_Y: Record<Fila, number> = {
	ext_superior: 0.42,
	int_superior: 0.18,
	int_inferior: 0.58,
	ext_inferior: 0.82,
	ambiente: 0.01,
	retorno: 0.9,
}

function calcColumnaX(sensores: SensorMock[]): Record<string, number> {
	const xMin = 0.18
	const xMax = 0.78
	const columnas = [...new Set(sensores.map(s => s.columna))]
		.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
	const n = columnas.length
	return Object.fromEntries(
		columnas.map((col, i) => [
			col,
			n === 1 ? xMin : xMin + (xMax - xMin) * (i / (n - 1)),
		])
	)
}

interface SensorPinProps {
	sensor: SensorMock
	x: number
	y: number
	onToggle: (id: string) => void
}

const SensorPin = memo(({ sensor, x, y, onToggle }: SensorPinProps) => {
	const handleClick = useCallback(() => onToggle(sensor.id), [sensor.id, onToggle])

	return (
		<div
			className="absolute"
			style={{
				left: `${x * 100}%`,
				top: `${y * 100}%`,
				transform: 'translate(-50%, -50%)',
			}}
		>
			<DataButton
				valor={sensor.valor}
				id={sensor.id}
				unidad="°C"
				habilitado={sensor.habilitado === true}
				fila={sensor.fila}
				onToggle={handleClick}  />
		</div>
	)
})

SensorPin.displayName = 'SensorPin'

export const Diagram = memo(({ title, image, ambienteId }: DiagramProps) => {

	const [sensores, setSensores] = useState<SensorMock[]>(
		() => MOCK_SENSORES[ambienteId] ?? []
	)

	const colX = useMemo(() => calcColumnaX(sensores), [sensores])

	const handleToggle = useCallback((sensorId: string) => {
		setSensores(prev =>
			prev.map(s => s.id === sensorId ? { ...s, habilitado: !s.habilitado } : s)
		)
	}, [])

	return (
		<div className="flex flex-col h-full">
			<div className="relative w-full flex-1 overflow-hidden">
				<img
					src={image}
					alt={title}
					className="w-full object-contain select-none"
				/>
				{sensores.length === 0 && (
					<Message />
				)}
				{sensores.map(s => (
					<SensorPin
						key={s.id}
						sensor={s}
						x={colX[s.columna]}
						y={FILA_Y[s.fila]}
						onToggle={handleToggle}
					/>
				))}
			</div>
		</div>
	)
})

Diagram.displayName = 'Diagram'
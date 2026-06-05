import { useState, useCallback, memo } from 'react'
import { MOCK_SENSORES, type SensorMock } from '../mock-data/sensores.mock'
import { DataButton } from './DataButton'
import { Message } from './Message'
import clsx from 'clsx'

interface DiagramProps {
	image: string
	ambienteId: number
}

function getGridPos(posicion: number) {
	if (posicion <= 16) {
		return {
			gridRow: posicion % 2 === 0 ? 1 : 2,
			gridColumn: Math.ceil(posicion / 2),
		}
	} else {
		const p = posicion - 16
		return {
			gridRow: p % 2 === 0 ? 4 : 3,
			gridColumn: Math.ceil(p / 2),
		}
	}
}

interface SensorPinProps {
	sensor: SensorMock
	onToggle: (id: string) => void
}

const SensorPin = memo(({ sensor, onToggle }: SensorPinProps) => {
	const handleClick = useCallback(() => onToggle(sensor.id), [sensor.id, onToggle])

	return (
		<DataButton
			valor={sensor.valor}
			id={sensor.id}
			unidad="°C"
			habilitado={sensor.habilitado === true}
			fila={sensor.fila}
			onToggle={handleClick} />
	)
})

SensorPin.displayName = 'SensorPin'

const POSICIONES_AMBIENTE = [101, 102]

export const Diagram = memo(({ image, ambienteId }: DiagramProps) => {
	const [sensores, setSensores] = useState<SensorMock[]>(
		() => MOCK_SENSORES[ambienteId] ?? []
	)

	const handleToggle = useCallback((sensorId: string) => {
		setSensores(prev =>
			prev.map(s => s.id === sensorId ? { ...s, habilitado: !s.habilitado } : s)
		)
	}, [])

	const sensoresGrilla = sensores.filter(s => !POSICIONES_AMBIENTE.includes(s.posicion))
	const sensoresAmbiente = sensores.filter(s => POSICIONES_AMBIENTE.includes(s.posicion))

	return (
		<div
			className="relative w-[1200px] h-full overflow-hidden bg-no-repeat bg-contain"
			style={{ backgroundImage: `url(${image})` }}
		>
			{sensores.length === 0 ? (
				<Message />
			) : (
				<>
					<div
						className="grid grid-cols-8 grid-rows-4 gap-2 ml-59 mt-16 mr-72"
						style={{ gridTemplateRows: '1fr 98px 1fr 1fr 1fr' }}
					>
						{sensoresGrilla.map(s => (
							<div key={s.id} style={getGridPos(s.posicion)}>
								<SensorPin sensor={s} onToggle={handleToggle} />
							</div>
						))}
					</div>

					<div>
						{sensoresAmbiente.map(s => (
							<div key={s.id} className={clsx("absolute", s.id === "A01" ? "top-45 left-20" : "right-30 top-45")}>
								<SensorPin sensor={s} onToggle={handleToggle} />
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
})

Diagram.displayName = 'Diagram'
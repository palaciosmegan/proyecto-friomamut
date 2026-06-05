import { useState, useCallback, useEffect, useRef, memo } from 'react'
import { MOCK_SENSORES, type SensorMock } from '../mock-data/sensores.mock'
import { DataButton } from './DataButton'
import { Message } from './Message'

interface DiagramProps {
	image: string
	ambienteId: number
}

// Aspect ratio bounds for the diagram image (width:height)
// Natural ≈ 366:125 | Max height stretch: 125:56 | Min height floor: 1250:340
const ASPECT_MAX_STRETCH = '125/56'
const MIN_HEIGHT_VW = '27.2vw' // (34/125) * 100vw — 1250:340 ratio floor

// Grid layout: left dead zone | 8 equal sensor columns | right dead zone
const GRID_COLUMNS = '2.7fr repeat(8, 1fr) 3.3fr'
const GRID_ROWS = 'repeat(7, 1fr)'

const posicionesOnGridArea = {
	1: "3/2",
	2: "2/2",
	3: "3/3",
	4: "2/3",
	5: "3/4",
	6: "2/4",
	7: "3/5",
	8: "2/5",
	9: "3/6",
	10: "2/6",
	11: "3/7",
	12: "2/7",
	13: "3/8",
	14: "2/8",
	15: "3/9",
	16: "2/9",
	17: "5/2",
	18: "6/2",
	19: "5/3",
	20: "6/3",
	21: "5/4",
	22: "6/4",
	23: "5/5",
	24: "6/5",
	25: "5/6",
	26: "6/6",
	27: "5/7",
	28: "6/7",
	29: "5/8",
	30: "6/8",
	31: "5/9",
	32: "6/9",
	101: "4/1",
	102: "4/10"
}

function getGridPos(posicion: number) {
	const area = posicionesOnGridArea[posicion as keyof typeof posicionesOnGridArea]
	if (!area) return {}
	const [row, col] = area.split('/')
	const alignTop = (posicion <= 16 && posicion % 2 === 0) || (posicion > 16 && posicion % 2 !== 0)
	return {
		gridRow: row,
		gridColumn: col,
		alignSelf: posicion > 100 ? 'center' : alignTop ? 'start' : 'end',
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

export const Diagram = memo(({ image, ambienteId }: DiagramProps) => {
	const [sensores, setSensores] = useState<SensorMock[]>(
		() => MOCK_SENSORES[ambienteId] ?? []
	)
	const imgRef = useRef<HTMLImageElement>(null)
	const [imgHeight, setImgHeight] = useState<number | undefined>()

	useEffect(() => {
		const img = imgRef.current
		if (!img) return
		const ro = new ResizeObserver(() => setImgHeight(img.clientHeight))
		ro.observe(img)
		return () => ro.disconnect()
	}, [])

	const handleToggle = useCallback((sensorId: string) => {
		setSensores(prev =>
			prev.map(s => s.id === sensorId ? { ...s, habilitado: !s.habilitado } : s)
		)
	}, [])

	return (
		<div className="relative w-full h-full">
			<img
				ref={imgRef}
				src={image}
				alt=""
				className={`w-full max-h-full object-fill aspect-[${ASPECT_MAX_STRETCH}]`}
				style={{ minHeight: MIN_HEIGHT_VW }}
			/>

			{sensores.length === 0 ? (
				<Message />
			) : (
				<div className="absolute inset-x-0 top-0" style={{ height: imgHeight ?? '100%' }}>
					<div
						className="grid h-full place-items-center items-stretch"
						style={{
							gridTemplateRows: GRID_ROWS,
							gridTemplateColumns: GRID_COLUMNS,
						}}
					>
						{sensores.map(s => (
							<div key={s.id} style={getGridPos(s.posicion)}>
								<SensorPin sensor={s} onToggle={handleToggle} />
							</div>
						))}

						{[
							{ label: 'EXT', row: 2 },
							{ label: 'INT', row: 3 },
							{ label: 'INT', row: 5 },
							{ label: 'EXT', row: 6 },
						].map(({ label, row }, i) => (
							<div
								key={`fila-label-${i}`}
								className="lg:hidden short:block text-xxs font-semibold text-white bg-[var(--color-deep)] border border-white/10 rounded px-1.5 py-0.5"
								style={{ gridRow: row, gridColumn: 1, alignSelf: 'center', justifySelf: 'end', marginRight: '0.35rem' }}
							>
								{label}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
})

Diagram.displayName = 'Diagram'
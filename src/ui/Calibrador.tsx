import { memo, forwardRef, useMemo, /*  useState,useCallback, useEffect, useImperativeHandle */ } from 'react'
import { Message } from './Message'
import { useRootData } from '../RootDataContext'
import { SensorTable } from './SensorTable'

export interface CalibradorHandle {
	reset: () => void
}

interface CalibradorProps {
	ambienteId: number
	isActive: boolean
}

export const Calibrador = memo(forwardRef<CalibradorHandle, CalibradorProps>(({ ambienteId }) => {

	const { sensoresMap, offsetsMap } = useRootData()
	const sensores = useMemo(() => sensoresMap[ambienteId] ?? [], [sensoresMap, ambienteId])
	// const [corrections, setCorrections] = useState<Record<string, string>>({})

	// useEffect(() => {
	// 	const offsets = offsetsMap[ambienteId] ?? {}
	// 	setCorrections(
	// 		Object.fromEntries(
	// 			Object.entries(offsets)
	// 				.filter(([, v]) => v !== 0)
	// 				.map(([k, v]) => [k, String(v)])
	// 		)
	// 	)
	// }, [ambienteId, offsetsMap])

	// const handleCorrectionChange = useCallback((id: string, value: string) => {
	// 	setCorrections(prev => ({ ...prev, [id]: value }))
	// }, [])

	// const handleReset = useCallback(() => {
	// 	const offsets = offsetsMap[ambienteId] ?? {}
	// 	setCorrections(
	// 		Object.fromEntries(
	// 			Object.entries(offsets)
	// 				.filter(([, v]) => v !== 0)
	// 				.map(([k, v]) => [k, String(v)])
	// 		)
	// 	)
	// }, [ambienteId, offsetsMap])

	// useImperativeHandle(ref, () => ({ reset: handleReset }), [handleReset])

	const left = sensores.filter(s => s.posicion % 2 !== 0 && s.posicion < 100)
	const right = sensores.filter(s => s.posicion % 2 === 0 && s.posicion < 100)

	// const hasCorrections = Object.values(corrections).some(v => v !== '')

	return (
		<div className="p-4">
			{sensores.length === 0 ? (
				<Message />
			) : (
				<div className="flex flex-col xl:flex-row gap-6 items-center">
					<SensorTable
						sensores={left}
						offsets={offsetsMap}
						// onCorrectionChange={handleCorrectionChange}
						unidad="°C"
					/>
					<SensorTable
						sensores={right}
						offsets={offsetsMap}
						// onCorrectionChange={handleCorrectionChange}
						unidad="°C"
					/>
				</div>
			)}
			<div className="flex gap-3 justify-end mt-6 mr-6">
				<button
					type="button"
					// disabled={!hasCorrections}
					className="btn btn-primary"
				>
					Guardar registro
				</button>
				<button type="button" className="btn btn-secondary">
					Reset
				</button>
			</div>
		</div>
	)
}))

Calibrador.displayName = 'Calibrador'

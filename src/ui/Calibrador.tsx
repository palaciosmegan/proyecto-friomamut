import { useState, memo, useCallback, useImperativeHandle, forwardRef, useMemo } from 'react'
import { Message } from './Message'
import type { Sensor } from '../types/sensor.types'
import { SensorRow } from './SensorRow'
import { useRootData } from '../RootDataContext'
import { actualizarSensorActivo } from '../api/sensores.api'

export interface CalibradorHandle {
	reset: () => void
}

interface CalibradorProps {
	ambienteId: number
	isActive: boolean
}

const SensorTable = ({ sensores, corrections, onCorrectionChange, onEnabledChange, unidad }: {
	sensores: Sensor[]
	corrections: Record<string, string>
	onCorrectionChange: (id: string, value: string) => void
	onEnabledChange: (id: string) => void
	unidad: string
}) => (
	<table className="border-collapse w-fit margin-auto flex-1  ">
		<thead>
			<tr className="border-b border-[var(--color-border-default)]">
				{['', 'Descripción', 'Corrección', 'Temperatura', 'Auto'].map(col => (
					<th key={col} className="py-2 px-3 text-center text-xs font-medium tracking-wider uppercase text-[var(--color-blue-soft)]">
						{col}
					</th>
				))}
			</tr>
		</thead>
		<tbody>
			{sensores.map(s => (
				<SensorRow
					key={s.id}
					sensor={s}
					correction={corrections[s.id] ?? ''}
					savedCorrection={''}
					enabled={s.habilitado}
					onCorrectionChange={onCorrectionChange}
					onEnabledChange={onEnabledChange}
					unidad={unidad}
				/>
			))}
		</tbody>
	</table>
)

export const Calibrador = memo(forwardRef<CalibradorHandle, CalibradorProps>(({ ambienteId }, ref) => {

	const { sensoresMap, updateSensorHabilitado } = useRootData()
	const sensores = useMemo(() => sensoresMap[ambienteId] ?? [], [sensoresMap, ambienteId])

	const [corrections, setCorrections] = useState<Record<string, string>>({})

	const handleCorrectionChange = useCallback((id: string, value: string) => {
		setCorrections(prev => ({ ...prev, [id]: value }))
	}, [])

	const handleEnabledChange = useCallback((sensorId: string) => {
		const sensor = sensores.find(s => s.id === sensorId)
		if (!sensor) return
		if (sensor.sensorId === undefined) {
			console.error(`[API sensores] ${sensor.id} no tiene sensorId real y no puede actualizarse`)
			return
		}
		const nuevoEstado = !sensor.habilitado
		updateSensorHabilitado(ambienteId, sensorId, nuevoEstado)
		actualizarSensorActivo(ambienteId, sensor.sensorId, nuevoEstado).catch(error => {
			console.error(`[API sensores] Fallo al actualizar ${sensor.id}:`, error)
			updateSensorHabilitado(ambienteId, sensorId, !nuevoEstado)
		})
	}, [sensores, ambienteId, updateSensorHabilitado])

	// const handleGuardar = useCallback(() => {
	// setSensores(prev => prev.map(s => {
	// 	const corr = parseFloat(corrections[s.id] ?? '0') || 0
	// 	return corr !== 0 ? { ...s, valor: +((s.valor || 0) - corr).toFixed(1) } : s
	// }))
	// setSavedCorrections(prev => ({
	// 	...prev,
	// 	...Object.fromEntries(Object.entries(corrections).filter(([, v]) => v !== ''))
	// }))
	// setCorrections({})
	// }, [corrections])

	const handleReset = useCallback(() => {
		setCorrections({})
	}, [])

	useImperativeHandle(ref, () => ({ reset: handleReset }), [handleReset])

	const left = sensores.filter(s => s.posicion % 2 !== 0 && s.posicion < 102)
	const right = sensores.filter(s => s.posicion % 2 === 0 && s.posicion < 101)

	const hasCorrections = Object.values(corrections).some(v => v !== '')

	return (
		<div className="p-4">
			{sensores.length === 0 ? (
				<Message />
			) : (
				<div className="flex flex-col xl:flex-row gap-6 items-center">
					<SensorTable
						sensores={left}
						corrections={corrections}
						onCorrectionChange={handleCorrectionChange}
						onEnabledChange={handleEnabledChange}
						unidad="°C"
					/>
					<div className="w-px bg-[var(--color-border-subtle)] self-stretch" />
					<SensorTable
						sensores={right}
						corrections={corrections}
						onCorrectionChange={handleCorrectionChange}
						onEnabledChange={handleEnabledChange}
						unidad="°C"
					/>
				</div>
			)}
			<div className="flex gap-3 justify-end mt-6 mr-6">
				<button
					type="button"
					// onClick={handleGuardar}
					disabled={!hasCorrections}
					className="btn btn-primary"
				>
					Guardar registro
				</button>
				<button type="button" className="btn btn-secondary">
					No calibrado
				</button>
			</div>
		</div>
	)
}))

Calibrador.displayName = 'Calibrador'

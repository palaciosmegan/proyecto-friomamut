import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Message } from './Message'
import { useRootData } from '../RootDataContext'
import { SensorTable } from './SensorTable'
import { actualizarOffset } from '../api/calibrador.api'

export type PendingChange = { offset: number; visibilidad: boolean }

interface CalibradorProps {
	ambienteId: number
	isActive: boolean
}

export const Calibrador = memo(({ ambienteId }: CalibradorProps) => {
	const { sensoresMap, offsetsMap, updateOffset } = useRootData()
	const sensores = useMemo(() => sensoresMap[ambienteId] ?? [], [sensoresMap, ambienteId])

	const [pendingChanges, setPendingChanges] = useState<Record<string, PendingChange>>({})

	useEffect(() => {
		const ambienteOffsets = offsetsMap[ambienteId] ?? {}
		setPendingChanges(
			Object.fromEntries(
				Object.entries(ambienteOffsets).map(([codigo, offset]) => [
					codigo,
					{ offset, visibilidad: true },
				])
			)
		)
	}, [ambienteId, offsetsMap])

	const handleReset = useCallback(() => {
		const ambienteOffsets = offsetsMap[ambienteId] ?? {}
		setPendingChanges(
			Object.fromEntries(
				Object.entries(ambienteOffsets).map(([codigo, offset]) => [
					codigo,
					{ offset, visibilidad: true },
				])
			)
		)
	}, [ambienteId, offsetsMap])

	const handleOffsetChange = useCallback((codigoLectura: string, value: number) => {
		setPendingChanges(prev => ({
			...prev,
			[codigoLectura]: { ...prev[codigoLectura], offset: value },
		}))
	}, [])

	const handleVisibilidadChange = useCallback((codigoLectura: string) => {
		setPendingChanges(prev => ({
			...prev,
			[codigoLectura]: { ...prev[codigoLectura], visibilidad: !prev[codigoLectura]?.visibilidad },
		}))
	}, [])

	const handleGuardar = useCallback(async () => {
		await Promise.all(
			sensores
				.filter(sensor =>
					sensor.registroSensor !== undefined &&
					(pendingChanges[sensor.codigoLectura]?.offset ?? 0) !== (offsetsMap[ambienteId]?.[sensor.codigoLectura] ?? 0)
				)
				.map(sensor => {
					const change = pendingChanges[sensor.codigoLectura]
					return actualizarOffset({
						ambiente: sensor.registroAmbiente,
						sensor: sensor.registroSensor!,
						offset: change?.offset ?? 0,
						visibilidad: change?.visibilidad ?? true,
					}).then(() =>
						updateOffset(sensor.registroAmbiente, sensor.codigoLectura, change?.offset ?? 0)
					)
				})
		)
	}, [sensores, pendingChanges, updateOffset, ambienteId, offsetsMap])

	const left = sensores.filter(s => s.posicion % 2 !== 0 && s.posicion < 100)
	const right = sensores.filter(s => s.posicion % 2 === 0 && s.posicion < 100)

	const hasChanges = sensores.some(s => {
		const pending = pendingChanges[s.codigoLectura]
		return (pending?.offset ?? 0) !== (offsetsMap[ambienteId]?.[s.codigoLectura] ?? 0)
	})

	return (
		<div className="p-4">
			{sensores.length === 0 ? (
				<Message />
			) : (
				<div className="flex flex-col xl:flex-row gap-6 items-center">
					<SensorTable
						sensores={left}
						pendingChanges={pendingChanges}
						onOffsetChange={handleOffsetChange}
						onVisibilidadChange={handleVisibilidadChange}
						unidad="°C"
					/>
					<SensorTable
						sensores={right}
						pendingChanges={pendingChanges}
						onOffsetChange={handleOffsetChange}
						onVisibilidadChange={handleVisibilidadChange}
						unidad="°C"
					/>
				</div>
			)}
			<div className="flex gap-3 justify-end mt-6 mr-6">
				<button
					type="button"
					onClick={handleGuardar}
					disabled={!hasChanges}
					className="btn btn-primary"
				>
					Guardar registro
				</button>
				<button type="button" onClick={handleReset} disabled={!hasChanges} className="btn btn-secondary">
					Reset
				</button>
			</div>
		</div>
	)
})

Calibrador.displayName = 'Calibrador'
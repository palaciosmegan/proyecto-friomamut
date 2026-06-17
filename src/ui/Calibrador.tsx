import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Message } from './Message'
import { useRootData } from '../RootDataContext'
import { SensorTable } from './SensorTable'
import { actualizarOffset } from '../api/calibrador.api'
import type { PendingChange } from '../types/ui-types'
import { useCalibradorResponse } from '../hooks/useCalibradorResponse'
import { Toast } from './Toast'

interface CalibradorProps {
	ambienteId: number
	isActive: boolean
}

export const Calibrador = memo(({ ambienteId }: CalibradorProps) => {
	const { sensoresMap, offsetsMap, updateOffset, refreshSensores } = useRootData()
	const sensores = useMemo(() => sensoresMap[ambienteId] ?? [], [sensoresMap, ambienteId])

	const [pendingChanges, setPendingChanges] = useState<Record<string, PendingChange>>({})
	const { response, toastKey, wrapFunction, clearMessage } = useCalibradorResponse()

	useEffect(() => {
		const ambienteOffsets = offsetsMap[ambienteId] ?? {}
		setPendingChanges(prev =>
			Object.fromEntries(
				Object.entries(ambienteOffsets).map(([codigo, offset]) => [
					codigo,
					{ offset, visibilidad: prev[codigo]?.visibilidad ?? true },
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
			[codigoLectura]: {
				visibilidad: prev[codigoLectura]?.visibilidad ?? true,
				offset: value,
			},
		}))
	}, [])

	const handleVisibilidadChange = useCallback((codigoLectura: string) => {
		setPendingChanges(prev => ({
			...prev,
			[codigoLectura]: { ...prev[codigoLectura], visibilidad: !prev[codigoLectura]?.visibilidad },
		}))
	}, [])

	const handleGuardar = useCallback(() => {
		const changed = sensores.filter(s =>
			s.registroSensor !== undefined &&
			(pendingChanges[s.codigoLectura]?.offset ?? 0) !== (offsetsMap[ambienteId]?.[s.codigoLectura] ?? 0)
		)

		wrapFunction(async () => {
			await actualizarOffset(sensores.filter(s => s.registroSensor !== undefined).map(sensor => ({
				ambiente: sensor.registroAmbiente,
				sensor: sensor.registroSensor!,
				offset: pendingChanges[sensor.codigoLectura]?.offset ?? 0,
				visibilidad: pendingChanges[sensor.codigoLectura]?.visibilidad ?? true,
			})))

			changed.forEach(sensor =>
				updateOffset(sensor.registroAmbiente, sensor.codigoLectura, pendingChanges[sensor.codigoLectura]?.offset ?? 0)
			)

			refreshSensores(ambienteId)
		})
	}, [sensores, pendingChanges, offsetsMap, ambienteId, updateOffset, refreshSensores, wrapFunction])

	const left = sensores.filter(s => s.posicion % 2 !== 0 && s.posicion < 100)
	const right = sensores.filter(s => s.posicion % 2 === 0 && s.posicion < 100)

	return (
		<>
			<div className="xl:p-4">
				{sensores.length === 0 ? (
					<Message />
				) : (
					<div className="flex flex-col hmi:flex-row gap-6 items-center">
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
						className="btn btn-primary"
					>
						Guardar registro
					</button>
					<button type="button" onClick={handleReset} className="btn btn-secondary">
						Reset
					</button>
				</div>
			</div>
			{response !== null && (
				<Toast
					key={toastKey}
					message={response.message}
					variant={response.ok ? 'success' : 'error'}
					callback={clearMessage}
				/>
			)}
		</>
	)
})

Calibrador.displayName = 'Calibrador'

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
	const [autoCalibrated, setAutoCalibrated] = useState<Set<string>>(new Set())
	const { response, toastKey, wrapFunction, clearMessage } = useCalibradorResponse()

	const [showModal, setShowModal] = useState(false)

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
		setAutoCalibrated(new Set())
	}, [ambienteId, offsetsMap])

	const handleOffsetChange = useCallback((codigoLectura: string, value: number) => {
		setPendingChanges(prev => ({
			...prev,
			[codigoLectura]: {
				visibilidad: prev[codigoLectura]?.visibilidad ?? true,
				offset: value,
			},
		}))
		// A manual offset change re-enables that sensor's auto-calibrar button.
		setAutoCalibrated(prev => {
			if (!prev.has(codigoLectura)) return prev
			const next = new Set(prev)
			next.delete(codigoLectura)
			return next
		})
	}, [])

	const handleAutocalibrar = useCallback((codigoLectura: string, valor: number) => {
		// Zero out the corrected reading using the SAVED offset (the one `valor`
		// already reflects), not the pending one — so a pending number-input
		// edit doesn't pile onto the auto-calibration.
		const savedOffset = offsetsMap[ambienteId]?.[codigoLectura] ?? 0
		setPendingChanges(prev => ({
			...prev,
			[codigoLectura]: {
				visibilidad: prev[codigoLectura]?.visibilidad ?? true,
				offset: savedOffset - valor,
			},
		}))
		setAutoCalibrated(prev => new Set(prev).add(codigoLectura))
	}, [offsetsMap, ambienteId])

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
			setAutoCalibrated(new Set())
		})

		setShowModal(false)
	}, [sensores, pendingChanges, offsetsMap, ambienteId, updateOffset, refreshSensores, wrapFunction])

	const left = sensores.filter(s => s.posicion % 2 !== 0 && s.posicion < 100)
	const right = sensores.filter(s => s.posicion % 2 === 0 && s.posicion < 100)

	const hasChanges = sensores.some(s => {
		const savedOffset = offsetsMap[ambienteId]?.[s.codigoLectura] ?? 0
		const pendingOffset = pendingChanges[s.codigoLectura]?.offset ?? 0
		const pendingVis = pendingChanges[s.codigoLectura]?.visibilidad ?? true
		return pendingOffset !== savedOffset || pendingVis !== true
	})

	return (
		<>
			<div className="flex h-full flex-col xl:p-4">
				{sensores.length === 0 ? (
					<Message />
				) : (
					<div className="flex flex-1 min-h-0 flex-col hmi:flex-row gap-3 short:gap-1.5 items-stretch">
						<SensorTable
							sensores={left}
							pendingChanges={pendingChanges}
							onOffsetChange={handleOffsetChange}
							onVisibilidadChange={handleVisibilidadChange}
							autoCalibrated={autoCalibrated}
							onAutocalibrar={handleAutocalibrar}
							unidad="°C"
						/>
						<SensorTable
							sensores={right}
							pendingChanges={pendingChanges}
							onOffsetChange={handleOffsetChange}
							onVisibilidadChange={handleVisibilidadChange}
							autoCalibrated={autoCalibrated}
							onAutocalibrar={handleAutocalibrar}
							unidad="°C"
						/>
					</div>
				)}
				<div className="flex shrink-0 gap-3 justify-end mt-4 short:mt-1.5 mr-6">
					<button
						type="button"
						onClick={() => setShowModal(true)}
						className="btn btn-primary"
					>
						Guardar registro
					</button>
					<button type="button" onClick={handleReset} className={hasChanges ? 'btn btn-primary' : 'btn btn-secondary'}>
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
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
					<div className="flex flex-col gap-5 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-abyss)] p-6 shadow-xl w-80">
						<div className="flex flex-col gap-1">
							<h4 className="text-base font-semibold text-[var(--color-text-primary)]">Guardar cambios</h4>
							<p className="text-sm text-[var(--color-text-secondary)]">¿Confirmas que quieres guardar los cambios de calibración?</p>
						</div>
						<div className="flex gap-3 justify-end">
							<button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
								Cancelar
							</button>
							<button type="button" onClick={handleGuardar} className="btn btn-primary">
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
})

Calibrador.displayName = 'Calibrador'

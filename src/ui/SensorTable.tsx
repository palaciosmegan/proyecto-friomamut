import { memo } from "react"
import { Toggle } from "./Toggle"
import type { Sensor } from "../types/sensor.types"
import { NumberInput } from "./NumberInput"
import type { PendingChange } from "../types/ui-types"

interface SensorTableProps {
  sensores: Sensor[]
  pendingChanges: Record<string, PendingChange>
  onOffsetChange?: (codigoLectura: string, value: number) => void
  onVisibilidadChange?: (codigoLectura: string) => void
  unidad: string
}

const orientationParsed = { INT: 'Interior', EXT: 'Exterior' }

const getDisplayName = (sensor: Sensor) => {
  const sensorName = sensor.id
  return 'S' + sensorName.split('S')[1].replace(/^0+(?!$)/, '') + ' - ' + orientationParsed[sensor.orientation]
}

export const SensorTable = memo(({ sensores, pendingChanges, onOffsetChange, onVisibilidadChange, unidad }: SensorTableProps) => {
  const getChange = (sensor: Sensor): PendingChange =>
    pendingChanges[sensor.codigoLectura] ?? { offset: 0, visibilidad: true }

  const autocalibrar = (sensor: Sensor) => {
    if (sensor.valor == null) return
    const change = getChange(sensor)
    onOffsetChange?.(sensor.codigoLectura, change.offset - sensor.valor)
  }

  return (
    <div className="flex flex-1 min-h-0 min-w-0 h-full justify-center overflow-y-auto">
      <table className="border-collapse w-fit h-full">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            {['', 'Descripción', 'Corrección', 'Temperatura', 'Auto'].map(col => (
              <th key={col} className="py-2 short:py-0.5 text-center text-s font-medium tracking-wider uppercase text-[var(--color-blue-soft)]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <>
            {sensores.map(sensor => {
              const change = getChange(sensor)
              return (
                <tr key={sensor.id} className="border-separate border-spacing-2 border-[var(--color-border-subtle)] transition-colors hover:bg-[rgba(33,150,243,0.04)]">
                  <td className="px-3">
                    <Toggle
                      checked={change.visibilidad}
                      onChange={() => onVisibilidadChange?.(sensor.codigoLectura)}
                    />
                  </td>
                  <td className="w-31 py-1 short:py-0.5 text-sm tracking-wider text-[var(--color-text-secondary)]">
                    <label htmlFor={sensor.id}>
                      {getDisplayName(sensor)}
                    </label>
                  </td>
                  <td className="py-1 short:py-0.5 align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <NumberInput
                        id={sensor.id}
                        value={change.offset}
                        unit={unidad}
                        onChange={val => onOffsetChange?.(sensor.codigoLectura, val)}
                      />
                    </div>
                  </td>
                  <td className="text-center py-1 short:py-0.5 px-3 text-sm font-mono text-[var(--color-text-primary)] tabular-nums">
                    {sensor.valor != null ? sensor.valor.toFixed(1) : '—'} {unidad}
                  </td>
                  <td className="py-1 short:py-0.5 text-center">
                    <button
                      type="button"
                      onClick={() => autocalibrar(sensor)}
                      className="btn btn-primary px-2 py-1 text-[0.65rem] short:px-1.5 short:py-0.5 short:text-[0.55rem] tracking-wide uppercase"
                    >
                      auto calibrar
                    </button>
                  </td>
                </tr>
              )
            })}
          </>
        </tbody>
      </table>
    </div>
  )
})
SensorTable.displayName = 'SensorTable'

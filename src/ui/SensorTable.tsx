import { memo } from "react"
import { Toggle } from "./Toggle"
import type { Sensor } from "../types/sensor.types"
import { NumberInput } from "./NumberInput"

interface SensorTableProps {
  sensores: Sensor[]
  offsets: Record<number, Record<string, number>>
  enabled?: boolean
  onCorrectionChange?: (id: string, value: string) => void
  onEnabledChange?: (id: string) => void
  unidad: string
}

const orientationParsed = { INT: 'Interior', EXT: 'Exterior' }

const getDisplayName = (sensor: Sensor) => {
  const sensorName = sensor.id
  return 'S' + sensorName.split('S')[1].replace(/^0+(?!$)/, '') + ' - ' + orientationParsed[sensor.orientation]
}

export const SensorTable = memo(({ sensores, offsets, onCorrectionChange, unidad }: SensorTableProps) => {
  const getOffset = (sensor: Sensor) => {
    const offset = offsets[sensor.registroAmbiente]?.[sensor.codigoLectura] ?? 99
    return offset
  }

  return (
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
        <>
          {sensores.map(sensor => (
            <tr key={sensor.id} className="border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[rgba(33,150,243,0.04)]">
              <td className="px-3">
                <Toggle keepTurnedOn={sensor.posicion === 101}
                  checked={true}
                  onChange={() => console.log('aaaaaaaaaaaaaaaaaaaaaaaa')}
                />
              </td>
              <td className="w-40 py-2 px-3 text-sm tracking-wider text-[var(--color-text-secondary)]">
                <label htmlFor='correction'>
                  {getDisplayName(sensor)}
                </label>
              </td>
              <td className="flex py-2 px-3 gap-2">
                <NumberInput
                  sensorId={sensor.id}
                  correction={getOffset(sensor)}
                  unidad={unidad}
                  onCorrectionChange={onCorrectionChange ?? (() => { })}
                />
              </td>
              <td className="py-2 px-3 text-sm font-mono text-[var(--color-text-primary)] tabular-nums">
                {sensor.valor != null && (sensor.valor + getOffset(sensor)).toFixed(1)} {unidad}
              </td>
              <td><button className="btn btn-primary scale-75 tracking-wide uppercase">auto calibrar</button></td>
            </tr>
          ))}
        </>
      </tbody>
    </table>
  )
})
SensorTable.displayName = 'SensorTable'

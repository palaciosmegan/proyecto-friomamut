import { memo } from "react"
import { Toggle } from "./Toggle"
import type { Sensor } from "../types/sensor.types"
import { NumberInput } from "./NumberInput"
import type { PendingChange } from "../types/ui-types"
import { NIVEL_BG } from "../config/niveles.config"

interface SensorTableProps {
  sensores: Sensor[]
  pendingChanges: Record<string, PendingChange>
  onOffsetChange?: (codigoLectura: string, value: number) => void
  onVisibilidadChange?: (codigoLectura: string) => void
  autoCalibrated?: Set<string>
  onAutocalibrar?: (codigoLectura: string, valor: number) => void
  unidad: string
  titulo?: string
  // Si viene, el panel toma el color del nivel (mismo que en la vista de túneles y su leyenda)
  nivel?: number
  // Offsets guardados por codigoLectura, para saber qué valores cambiaron
  offsetsGuardados?: Record<string, number>
}


export const SensorTable = memo(({ sensores, pendingChanges, onOffsetChange, onVisibilidadChange, autoCalibrated, onAutocalibrar, unidad, titulo, nivel, offsetsGuardados }: SensorTableProps) => {
  const getChange = (sensor: Sensor): PendingChange =>
    pendingChanges[sensor.codigoLectura] ?? { offset: 0, visibilidad: true }

  const autocalibrar = (sensor: Sensor) => {
    if (sensor.valor == null) return
    // Autocalibrar siempre arroja el mismo valor, lee el offset guardado del endpoint, no el actualizado por numberinput
    onAutocalibrar?.(sensor.codigoLectura, sensor.valor)
  }

  return (
    <div
      className="grid grid-rows-[minmax(0,0.75rem)_auto_1fr] justify-center flex-1 min-h-0 min-w-0 h-full overflow-y-auto rounded-lg border border-[var(--color-border-default)] px-4 py-3 short:px-2 short:py-1.5"
      style={nivel !== undefined ? { backgroundColor: `color-mix(in srgb, ${NIVEL_BG[nivel] ?? NIVEL_BG[1]} 60%, transparent)` } : undefined}
    >
      {/* Aire sobre el título: crece hasta 0.75rem solo si sobra espacio */}
      <div />
      {titulo ? (
        <div className="inline-flex items-center gap-2 pb-2 short:pb-1 text-sm short:text-xs font-semibold uppercase tracking-wider text-[var(--color-blue-soft)]">
          {nivel !== undefined && (
            <span className="w-2.5 h-2.5 rounded-[3px] border border-green-500/40" style={{ backgroundColor: NIVEL_BG[nivel] ?? NIVEL_BG[1] }} />
          )}
          {titulo}
        </div>
      ) : <div />}
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
                <tr key={sensor.id} className="border-separate border-spacing-2 border-[var(--color-border-subtle)]">
                  <td className="px-3">
                    <Toggle
                      checked={change.visibilidad}
                      onChange={() => onVisibilidadChange?.(sensor.codigoLectura)}
                    />
                  </td>
                  <td className="w-31 py-1 short:py-0.5 text-sm tracking-wider text-[var(--color-text-secondary)]">
                    <label htmlFor={sensor.id}>
                      {sensor.id}
                    </label>
                  </td>
                  <td className="py-1 short:py-0.5 align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <NumberInput
                        id={sensor.id}
                        value={change.offset}
                        unit={unidad}
                        muted={change.offset === (offsetsGuardados?.[sensor.codigoLectura] ?? 0)}
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
                      disabled={autoCalibrated?.has(sensor.codigoLectura)}
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

import { NumberInput } from './NumberInput'

export interface RangeValue {
  min: number
  max: number
}

export interface RangeRow {
  key: string
  label: string
  value: RangeValue
}

interface RangeInputsProps {
  rows: RangeRow[]
  onChange: (key: string, bound: 'min' | 'max', value: number) => void
  unit?: string
  step?: number
  idPrefix?: string
}

// Bloque de rangos con encabezado MÍN/MÁX y una fila por cada RangeRow, con dos
// NumberInputs (mín y máx) lado a lado. NumberInput es un fragmento de 3 piezas
// (- input +), así que cada uno va envuelto en un flex para acomodarse en línea.
export const RangeInputs = ({ rows, onChange, unit = '°C', step, idPrefix }: RangeInputsProps) => {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-3 gap-y-2">
      {/* Encabezados */}
      <span />
      <span className="text-center text-[0.65rem] uppercase tracking-wider text-[var(--color-text-secondary)]">Mín</span>
      <span className="text-center text-[0.65rem] uppercase tracking-wider text-[var(--color-text-secondary)]">Máx</span>

      {rows.map(row => (
        <div key={row.key} className="contents">
          <span className="text-xs text-[var(--color-text-secondary)]">{row.label}</span>
          <div className="flex items-center justify-center gap-1">
            <NumberInput
              id={idPrefix ? `${idPrefix}-${row.key}-min` : undefined}
              value={row.value.min}
              step={step}
              unit={unit}
              onChange={v => onChange(row.key, 'min', v)}
            />
          </div>
          <div className="flex items-center justify-center gap-1">
            <NumberInput
              id={idPrefix ? `${idPrefix}-${row.key}-max` : undefined}
              value={row.value.max}
              step={step}
              unit={unit}
              onChange={v => onChange(row.key, 'max', v)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

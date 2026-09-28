import clsx from "clsx"

interface NumberInputProps {
  id?: string
  value: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  // Valor sin cambios respecto al guardado: el número se muestra apagado
  muted?: boolean
}

export const NumberInput = ({ id, value, step = 0.1, unit, onChange, muted = false }: NumberInputProps) => {
  const decimals = step.toString().split('.')[1]?.length ?? 0

  return (
    <>
      <button
        type="button"
        className="btn-tertiary"
        onClick={() => onChange(parseFloat((value - step).toFixed(decimals)))}
      >
        -
      </button>
      <div className={clsx("flex items-center justify-center py-1 short:py-0", muted ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]' )}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={`0.${'0'.repeat(decimals)}`}
          value={value.toFixed(decimals)}
          onChange={() => {}}
          disabled
          className="w-11 text-center bg-transparent outline-none text-sm font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[var(--color-text-secondary)]"
        />
        {unit && <span className="text-sm font-mono select-none mr-1">{unit}</span>}
      </div>
      <button
        type="button"
        className="btn-tertiary"
        onClick={() => onChange(parseFloat((value + step).toFixed(decimals)))}
      >
        +
      </button>
    </>
  )
}

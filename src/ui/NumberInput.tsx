interface NumberInputProps {
  id?: string
  value: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

export const NumberInput = ({ id, value, step = 0.1, unit, onChange }: NumberInputProps) => {
  const decimals = step.toString().split('.')[1]?.length ?? 0

  return (
    <>
      <button
        type="button"
        className="bg-[#0d3a6e] border border-[var(--color-blue-bright)] rounded px-3 py-2 text-base font-bold leading-none active:scale-95 transition-all select-none"
        onClick={() => onChange(parseFloat((value - step).toFixed(decimals)))}
      >
        -
      </button>
      <div className="flex items-center justify-center py-1">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={`0.${'0'.repeat(decimals)}`}
          value={value.toFixed(decimals)}
          onChange={() => {}}
          disabled
          className="w-11 text-center bg-transparent outline-none text-sm font-mono text-[var(--color-text-primary)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[var(--color-text-secondary)]"
        />
        {unit && <span className="text-sm font-mono select-none text-[var(--color-text-secondary)] mr-1">{unit}</span>}
      </div>
      <button
        type="button"
        className="bg-[#0d3a6e] border border-[var(--color-blue-bright)] rounded px-3 py-2 text-base font-bold leading-none active:scale-95 transition-all select-none"
        onClick={() => onChange(parseFloat((value + step).toFixed(decimals)))}
      >
        +
      </button>
    </>
  )
}

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
        className="items-center gap-0 bg-[#0d3a6e] border border-[var(--color-blue-bright)] rounded px-2 py-1 transition-all focus-within:shadow-[0_0_0_3px_rgba(33,150,243,0.25),var(--glow-blue)]"
        onClick={() => onChange(parseFloat((value - step).toFixed(decimals)))}
      >
        -
      </button>
      <div className="items-center gap-0 py-1 transition-all focus-within:shadow-[0_0_0_3px_rgba(33,150,243,0.25),var(--glow-blue)]">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={`0.${'0'.repeat(decimals)}`}
          value={value.toFixed(decimals)}
          onChange={() => {}}
          disabled
          className="self-center w-11 text-center bg-transparent outline-none text-sm font-mono text-[var(--color-text-primary)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[var(--color-text-secondary)]"
        />
        {unit && <span className="text-sm font-mono select-none text-[var(--color-text-secondary)] mr-1">{unit}</span>}
      </div>
      <button
        type="button"
        className="items-center gap-0 bg-[#0d3a6e] border border-[var(--color-blue-bright)] rounded px-2 py-1 transition-all focus-within:shadow-[0_0_0_3px_rgba(33,150,243,0.25),var(--glow-blue)]"
        onClick={() => onChange(parseFloat((value + step).toFixed(decimals)))}
      >
        +
      </button>
    </>
  )
}

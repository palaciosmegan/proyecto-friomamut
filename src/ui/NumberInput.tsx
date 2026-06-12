import { useState } from "react"

interface NumberInputProps {
  sensorId: string
  // handleDecrement: () => void
  // handleIncrement: () => void
  correction: string
  unidad: string
  // onCorrectionChange: () => void
}

export const NumberInput = ({ sensorId, correction, unidad, /* onCorrectionChange */ }: NumberInputProps) => {
  const [number, setNumber] = useState(correction)
  const handleDecrement = () =>
    setNumber(((parseFloat(correction) || 0) - 0.1).toFixed(1))
  // onCorrectionChange(sensor.id, ((parseFloat(correction) || 0) - 0.1).toFixed(1))

  const handleIncrement = () =>
    setNumber(((parseFloat(correction) || 0) + 0.1).toFixed(1))

  // onCorrectionChange(sensor.id, ((parseFloat(correction) || 0) + 0.1).toFixed(1))

  return (
    <>
      <button type="button"
        className="items-center gap-0 bg-[#0d3a6e] border border-[var(--color-blue-bright)] rounded px-2 py-1 transition-all focus-within:shadow-[0_0_0_3px_rgba(33,150,243,0.25),var(--glow-blue)]"
        onClick={handleDecrement}>
        -
      </button>
      <div className="items-center gap-0 px-2 py-1 transition-all focus-within:shadow-[0_0_0_3px_rgba(33,150,243,0.25),var(--glow-blue)]">
        <input
          id={sensorId}
          type="number"
          step="0.1"
          placeholder={correction || "0.0"}
          value={number}
          readOnly
          // onChange={e => onCorrectionChange(sensor.id, e.target.value)}
          // onChange={onCorrectionChange}
          className="w-11 text-center bg-transparent outline-none text-sm font-mono text-[var(--color-text-primary)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[var(--color-text-secondary)]"
        />
        <span className={`text-sm font-mono select-none text-[var(--color-text-secondary)]`}>{unidad}</span>
      </div>
      <button
        type="button"
        className="items-center gap-0 bg-[#0d3a6e] border border-[var(--color-blue-bright)] rounded px-2 py-1 transition-all focus-within:shadow-[0_0_0_3px_rgba(33,150,243,0.25),var(--glow-blue)]"
        onClick={handleIncrement}>
        +
      </button>
    </>
  )
}
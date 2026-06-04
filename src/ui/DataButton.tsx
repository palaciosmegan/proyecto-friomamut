import { memo } from 'react'
import { clsx } from 'clsx'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import type { SensorMock } from '../mock-data/sensores.mock'

type DataButtonProps = Omit<SensorMock, 'posicion' | 'columna'> & {
  unidad: string
  onToggle: () => void
}

export const DataButton = memo(({
  id,
  valor,
  habilitado,
  fila,
  unidad,
  onToggle,
}: DataButtonProps) => {
  const active = habilitado ? 'text-gray-400' : 'text-[var(--color-text-muted)]'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'aspect-[4/3] w-24 rounded-lg border flex flex-col items-center justify-center gap-2 select-none outline-none transition-all duration-150 active:scale-90 bg-[var(--color-deep)]',
        habilitado ? 'border-green-500/60' : 'border-[var(--color-border-default)]',
      )}
    >
      <div className="flex justify-between items-start w-full px-2">
        <FiberManualRecordIcon
          className={habilitado ? 'text-green-400 animate-pulse' : 'text-[var(--color-text-muted)]'}
          style={{ fontSize: 10 }}
        />
        <p className={clsx('text-xs font-medium tracking-wide', active)}>
          {id} - {fila.substring(0, 3).toUpperCase()}
        </p>
      </div>

      <div className="flex w-full justify-center items-baseline gap-1">
        <span className={clsx('text-2xl font-bold', habilitado ? 'text-white' : 'text-[var(--color-text-muted)]')}>
          {typeof valor === 'number' ? valor.toFixed(1) : '---'}
        </span>
        <span className={clsx('text-sm font-normal transition-colors duration-200', active)}>
          {unidad}
        </span>
      </div>
    </button>
  )
})

DataButton.displayName = 'DataButton'
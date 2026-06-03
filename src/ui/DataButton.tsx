import { memo } from 'react'
import { clsx } from 'clsx'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

interface DataButtonProps {
  metric: number
  descriptionShortened: string
  unit: string
  habilitado: boolean
  onToggle: () => void
}

export const DataButton = memo(({
  metric,
  descriptionShortened,
  unit,
  habilitado,
  onToggle,
}: DataButtonProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'aspect-[4/3] w-24 rounded-lg border flex flex-col items-center justify-center gap-2 select-none outline-none transition-all duration-150 active:scale-90 bg-[var(--color-deep)]',
        !habilitado && 'border-[var(--color-border-default)] opacity-50',
        habilitado && 'border-green-500/60',
      )}
    >
      <div className="flex justify-between items-start w-full px-2">
        <FiberManualRecordIcon
          className={habilitado ? 'text-green-400' : 'text-[var(--color-text-muted)]'}
          style={{ fontSize: 10 }}
        />
        <p className={clsx(
          'text-xs font-medium tracking-wide transition-colors duration-200',
          habilitado ? 'text-green-400' : 'text-[var(--color-text-muted)]'
        )}>
          {descriptionShortened.toUpperCase()}
        </p>
      </div>

      <div className="flex w-full justify-center items-baseline gap-1">
        <span className={clsx(
          'text-2xl font-bold transition-colors duration-200',
          habilitado ? 'text-white' : 'text-[var(--color-text-muted)]'
        )}>
          {typeof metric === 'number' ? metric.toFixed(1) : '---'}
        </span>
        <span className={clsx(
          'text-sm font-normal transition-colors duration-200',
          habilitado ? 'text-green-400' : 'text-[var(--color-text-muted)]'
        )}>
          {unit}
        </span>
      </div>
    </button>
  )
})

DataButton.displayName = 'DataButton'
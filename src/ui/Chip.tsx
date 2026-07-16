import { clsx } from 'clsx'

interface ChipProps {
  label: string
  variant?: 'gray' | 'green'
}

export const Chip = ({ label, variant = 'gray' }: ChipProps) => (
  <span className={clsx(
    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide select-none',
    variant === 'green' && 'bg-green-950/70 border border-green-600/40 text-green-300',
    variant === 'gray'  && 'bg-gray-400 border border-gray-500 text-gray-600',
  )}>
    <span className={clsx(
      'w-1.5 h-1.5 rounded-full',
      variant === 'green' && 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]',
      variant === 'gray'  && 'bg-gray-600',
    )} />
    {label}
  </span>
)

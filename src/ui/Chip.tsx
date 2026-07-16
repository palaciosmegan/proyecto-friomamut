import { clsx } from 'clsx'

interface ChipProps {
  label: string
  variant?: 'gray' | 'green'
}

export const Chip = ({ label, variant = 'gray' }: ChipProps) => (
  <span className={clsx(
    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold select-none shadow-md border',
    variant === 'green' && 'bg-green-50 border-green-600/60 text-green-700',
    variant === 'gray'  && 'bg-gray-100 border-gray-500/70 text-gray-600',
  )}>
    <span className={clsx(
      'w-2.5 h-2.5 rounded-full',
      variant === 'green' && 'bg-green-500',
      variant === 'gray'  && 'bg-gray-500',
    )} />
    {label}
  </span>
)

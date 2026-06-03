import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import SyncIcon from '@mui/icons-material/Sync'
import ErrorIcon from '@mui/icons-material/Error';
import { clsx } from 'clsx'
import { ChipStatus } from '../types/ui-types'

const CONFIG = {
  [ChipStatus.LIVE]: {
    label: 'En tiempo real',
    bg: 'bg-green-950',
    text: 'text-green-400',
    border: 'border-green-800',
    icon: (
      <FiberManualRecordIcon
        className="text-green-400 animate-pulse"
        style={{ fontSize: 10 }}
      />
    ),
  },
  [ChipStatus.RECONNECTING]: {
    label: 'Reconectando',
    bg: 'bg-yellow-950',
    text: 'text-yellow-400',
    border: 'border-yellow-800',
    icon: (
      <SyncIcon
        className="text-yellow-400 animate-spin"
        style={{ fontSize: 13 }}
      />
    ),
  },
  [ChipStatus.ERROR]: {
    label: 'Error',
    bg: 'bg-red-950',
    text: 'text-red-400',
    border: 'border-red-800',
    icon: (
      <ErrorIcon
        className="text-red-400"
        style={{ fontSize: 13 }}
      />
    ),
  },
}

type ChipProps = {
  status: typeof ChipStatus[keyof typeof ChipStatus]
}

export const Chip = ({ status }: ChipProps) => {
  const { label, bg, text, border, icon } = CONFIG[status]

  return (
    <div className={clsx(
      'inline-flex items-center gap-1.5',
      'rounded-full border px-3 py-1 text-xs font-medium',
      bg, text, border
    )}>
      {icon}
      <span>{label}</span>
    </div>
  )
}
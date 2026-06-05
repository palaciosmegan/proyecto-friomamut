import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import SyncIcon from '@mui/icons-material/Sync'
import ErrorIcon from '@mui/icons-material/Error'
import { ChipStatus } from '../types/ui-types'

const CONFIG = {
  [ChipStatus.LIVE]: {
    label: 'En tiempo real',
    glow: { '--glow-r': '74', '--glow-g': '222', '--glow-b': '128' },
    text: 'text-[rgba(134,239,172,0.95)]',
    icon: <FiberManualRecordIcon className="text-[rgba(134,239,172,0.9)] animate-pulse" style={{ fontSize: 10 }} />,
  },
  [ChipStatus.RECONNECTING]: {
    label: 'Reconectando',
    glow: { '--glow-r': '255', '--glow-g': '195', '--glow-b': '0' },
    text: 'text-[rgba(255,230,140,0.9)]',
    icon: <SyncIcon className="text-[rgba(255,210,80,0.85)] animate-spin" style={{ fontSize: 13 }} />,
  },
  [ChipStatus.ERROR]: {
    label: 'Error de conexión',
    glow: { '--glow-r': '248', '--glow-g': '113', '--glow-b': '113' },
    text: 'text-[rgba(252,165,165,0.95)]',
    icon: <ErrorIcon className="text-[rgba(252,165,165,0.9)]" style={{ fontSize: 13 }} />,
  },
}

type ChipProps = {
  status: typeof ChipStatus[keyof typeof ChipStatus]
}

export const Chip = ({ status }: ChipProps) => {
  const { label, glow, text, icon } = CONFIG[status]

  return (
    <div
      className={`glass-pill gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide ${text}`}
      style={glow as React.CSSProperties}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}

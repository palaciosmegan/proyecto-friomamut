import { useState } from 'react'
import { clsx } from 'clsx'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface DataButtonProps {
    metric: number,
    descriptionShortened: string,
    unit: string
}

interface DataButtonProps {
    metric: number
    descriptionShortened: string
    unit: string
}

export const DataButton = ({ metric, descriptionShortened, unit }: DataButtonProps) => {
    const [active, setActive] = useState(false)

    return (
        <button
            onClick={() => setActive(prev => !prev)}
            className={clsx(
                'aspect-[4/3] w-24 rounded-lg border flex flex-col items-center justify-center gap-2 relative',
                'select-none outline-none',
                'transition-all duration-150 active:scale-90',

                !active && 'bg-[var(--color-deep)] border-[var(--color-border-default)] opacity-50',
                active && 'bg-[var(--color-deep)] border-green-500/60 shadow-[0_0_12px_rgba(34,197,94,0.25)]',
            )}
        >
            <FiberManualRecordIcon
                className={clsx(
                    'absolute top-1.5 left-1.5', active ? 'text-green-400' : 'text-[var(--color-text-muted)]'
                )}
                style={{ fontSize: 10 }}
            />

            <p className={clsx(
                'w-full text-xs text-right px-2 font-medium tracking-wide transition-colors duration-200',
                active ? 'text-green-400' : 'text-[var(--color-text-muted)]'
            )}>
                {descriptionShortened.length <= 3
                    ? descriptionShortened
                    : descriptionShortened.slice(0, 3)}
            </p>

            <p className={clsx(
                'text-2xl font-bold transition-colors duration-200',
                active ? 'text-white' : 'text-[var(--color-text-muted)]'
            )}>
                {metric}
                <span className={clsx(
                    'text-sm font-normal ml-1 transition-colors duration-200',
                    active ? 'text-green-400' : 'text-[var(--color-text-muted)]'
                )}>
                    {unit}
                </span>
            </p>
        </button>
    )
}
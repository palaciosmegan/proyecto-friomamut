import { memo } from 'react'
import { clsx } from 'clsx'
import type { Sensor } from '../types/sensor.types'

const IconDot = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="8" />
  </svg>
)

const IconPlug = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={{ width: '1em', height: '1em' }}>
    <path d="M21,14c0-0.55-0.45-1-1-1h-2v2h2C20.55,15,21,14.55,21,14z"/>
    <path d="M20,17h-2v2h2c0.55,0,1-0.45,1-1C21,17.45,20.55,17,20,17z"/>
    <path d="M12,14h-2v4h2c0,1.1,0.9,2,2,2h3v-8h-3C12.9,12,12,12.9,12,14z"/>
    <path d="M5,13c0-1.1,0.9-2,2-2h1.5c1.93,0,3.5-1.57,3.5-3.5S10.43,4,8.5,4H5C4.45,4,4,4.45,4,5c0,0.55,0.45,1,1,1h3.5C9.33,6,10,6.67,10,7.5S9.33,9,8.5,9H7c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4h2v-2H7C5.9,15,5,14.1,5,13z"/>
  </svg>
)

type DataButtonProps = Pick<Sensor, 'id' | 'sensorId' | 'valor' | 'habilitado' | 'orientation'> & {
  unidad: string
  onToggle: () => void
}

function isInNormalRange(value: number | null, id: string) {
  if (value === null) return false
  if (id.substring(0, 1) === "A") return true
  else if (value < -30 || value > 30) return false
  else return true
}

export const DataButton = memo(({
  id, sensorId, valor, habilitado, orientation, unidad, onToggle,
}: DataButtonProps) => {
  const outOfRangeStyle = habilitado && !isInNormalRange(valor, id) && id.substring(0, 1) !== 'A'

  const isInAnActiveProcess = sensorId !== undefined && sensorId !== null

  const handleToggle = () => {
    if (!(id.substring(0, 1) === "A") && isInAnActiveProcess) {
      onToggle()
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      style={outOfRangeStyle ? { borderColor: '#8b1e1e' } : undefined}
      className={clsx(
        'items-center rounded-md border lg:whitespace-nowrap sm:w-15 lg:w-20 xl:w-22 2xl:w-25',
        'flex flex-col py-2 px-2 gap-0.5',
        'select-none outline-none transition-colors duration-150',
        habilitado
          ? 'border-green-500/40 bg-[var(--color-deep)]'
          : 'border-white/10 bg-[#798295]',
        (id.substring(0, 1) === "A" || !isInAnActiveProcess) ? 'w-17 sm:w-20 lg:w-24 xl:w-27 2xl:w-30 py-2.5 px-2.5 gap-1' : 'active:scale-95'
      )}
    >
      <span className='flex items-start'>
        {habilitado && isInNormalRange(valor, id) && (
          <IconDot className="text-green-400 animate-pulse" />
        )}
        {outOfRangeStyle && (
          <IconDot className="text-[#8b1e1e]" />
        )}
        <p className={clsx(
          'text-xxs sm:text-[0.5rem] lg:text-[0.65rem] align-baseline leading-none font-semibold mb-1',
          habilitado ? 'text-[#7ab8e8]' : 'text-[#c7c7c7]'
        )}>
          {id === 'A01' ? 'AMBIENTE' : id === 'A02' ? 'RETORNO' : id === 'A03' ? 'P. PALET' : id === 'A04' ? 'P. VEN.' : id === 'A05' ? 'CAU' : (
            <>
              {id}
              <span className="hidden short:hidden lg:inline"> · {orientation}</span>
            </>
          )}
        </p>
      </span>

      {valor !== null && (isInNormalRange(valor, id) || id.substring(0, 1) == 'A') ? (
        <div className="flex items-baseline gap-[2px]">
          <span className={clsx(
            'text-sm lg:text-card-large 2xl:text-xl font-bold tabular-nums leading-none',
            habilitado ? 'text-white' : 'text-[#c7c7c7]'
          )}>
            {valor.toFixed(1)}
          </span>
          <span className={clsx(
            'text-xxs lg:text-xs font-semibold leading-none',
            habilitado ? 'text-[#7ab8e8]' : 'text-[#c7c7c7]'
          )}>
            {unidad}
          </span>
        </div>
      ) : (
        <span className="text-sm lg:text-card-large 2xl:text-xl leading-none">
          <IconPlug className="text-[#c7c7c7]" />
        </span>
      )}
    </button>
  )
})

DataButton.displayName = 'DataButton'

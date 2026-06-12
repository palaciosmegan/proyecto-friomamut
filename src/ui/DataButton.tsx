import { memo } from 'react'
import { clsx } from 'clsx'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import type { SensorMock } from '../mock-data/sensores.mock'

type DataButtonProps = Omit<SensorMock, 'posicion'> & {
  unidad: string
  onToggle: () => void
}

function isInNormalRange(value: number, id: string) {
  if (id.substring(0, 1) === "A") return true
  else if (value < -30 || value > 30) return false
  else return true
}

export const DataButton = memo(({
  id, valor, habilitado, orientation, unidad, onToggle,
}: DataButtonProps) => {
  const outOfRangeStyle = habilitado && !isInNormalRange(valor, id) && id.substring(0, 1) !== 'A'

  const handleToggle = () => {
    if (!(id.substring(0, 1) === "A")) {
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
        id.substring(0, 1) === "A" ? '' : 'active:scale-95'
      )}
    >
      <span className='flex items-start'>
        {habilitado && isInNormalRange(valor, id) && (
          <FiberManualRecordIcon className="text-green-400 animate-pulse" style={{ fontSize: '10px' }} />
        )}
        {outOfRangeStyle && (
          <FiberManualRecordIcon className="text-[#8b1e1e]" style={{ fontSize: '10px' }} />
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

      {isInNormalRange(valor, id) ? (
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
          <ElectricalServicesIcon
            className='text-[#c7c7c7]'
            style={{ fontSize: '1em' }}
          />
        </span>
      )}
    </button>
  )
})

DataButton.displayName = 'DataButton'
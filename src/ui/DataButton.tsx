import { memo } from 'react'
import { clsx } from 'clsx'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import type { SensorMock } from '../mock-data/sensores.mock'

type DataButtonProps = Omit<SensorMock, 'posicion' | 'columna'> & {
  unidad: string
  onToggle: () => void
}

function isInNormalRange(value: number) {
  if (value < -30 || value > 30) return false
  return true
}

export const DataButton = memo(({
  id, valor, habilitado, fila, unidad, onToggle,
}: DataButtonProps) => {
  const handleOnToggle = () => {
    if (isInNormalRange(valor)) {
      onToggle()
    } else {
      console.log('no se puede activar porque se encuentra fuera de rango')
    }
  }

  const isActive = habilitado && isInNormalRange(valor)

  return (
    <button
      type="button"
      onClick={handleOnToggle}
      className={clsx(
        'items-center rounded-md border lg:whitespace-nowrap sm:w-15 lg:w-20 xl:w-22 2xl:w-25',
        'flex flex-col py-2 px-2 gap-0.5',
        'select-none outline-none transition-colors duration-150 active:scale-95',
        isActive
          ? 'border-green-500/40 bg-[var(--color-deep)]'
          : 'border-white/10 bg-[#798295]',
      )}
    >
      <span className='flex items-start'>
        {isActive && (
          <FiberManualRecordIcon
            className="text-green-400 animate-pulse"
            style={{ fontSize: '10px' }}
          />
        )
        }
        <p className={clsx(
          'text-xxs sm:text-[0.5rem] lg:text-[0.65rem] align-baseline leading-none font-semibold mb-1',
          isActive ? 'text-[#7ab8e8]' : 'text-[#c7c7c7]'
        )}>
          {id === 'A01' ? 'AMBIENTE' : id === 'A02' ? 'RETORNO' : (
            <>
              {id}
              <span className="hidden short:hidden lg:inline"> · {fila.substring(0, 3).toUpperCase()}</span>
            </>
          )}
        </p>
      </span>

      {isInNormalRange(valor) ? (
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
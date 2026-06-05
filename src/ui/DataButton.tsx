import { memo } from 'react'
import { clsx } from 'clsx'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import type { Fila, SensorMock } from '../mock-data/sensores.mock'

type DataButtonProps = Omit<SensorMock, 'posicion' | 'columna'> & {
  unidad: string
  onToggle: () => void
}

function sensorLabel(id: string, fila: Fila): string {
  if (id === 'A01') return 'Ambiente'
  if (id === 'A02') return 'Retorno'
  return `${id} · ${fila.substring(0, 3).toUpperCase()}`
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
        'relative w-[80px] items-center rounded-md border',
        'flex flex-col justify-center py-2 px-2 gap-0.5',
        'select-none outline-none transition-colors duration-150 active:scale-95',
        isActive
          ? 'border-green-500/40 bg-[var(--color-deep)]'
          : 'border-white/10 bg-gray-500',
      )}
    >
      {isActive && (
        <FiberManualRecordIcon
          className={clsx(
            'absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 text-green-400 animate-pulse'
          )}
          style={{ fontSize: 12 }}
        />)
      }

      <p className={clsx(
        'text-[0.6rem] leading-none font-medium mb-1',
        isActive ? 'text-[#7ab8e8]' : 'text-gray-600'
      )}>
        {sensorLabel(id, fila)}
      </p>

      {isInNormalRange(valor) ? (
        <div className="flex items-baseline gap-[2px]">
          <span className={clsx(
            'text-lg font-bold tabular-nums leading-none',
            habilitado ? 'text-white' : 'text-gray-600'
          )}>
            {typeof valor === 'number' ? valor.toFixed(1) : '---'}
          </span>
          <span className={clsx(
            'text-[0.6rem] font-medium leading-none',
            habilitado ? 'text-[#7ab8e8]' : 'text-gray-600'
          )}>
            {unidad}
          </span>
        </div>
      ) : (
        <ElectricalServicesIcon
          className='text-gray-700'
          style={{ fontSize: 20 }}
        />
      )}
    </button>
  )
})

DataButton.displayName = 'DataButton'
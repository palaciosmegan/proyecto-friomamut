import { memo } from 'react'
import { clsx } from 'clsx'
import type { Sensor } from '../types/sensor.types'
import { IconDot, IconPlug } from './icons'
import { NIVEL_BG } from '../config/niveles.config'

type DataButtonProps = Pick<Sensor, 'id' | 'sensorId' | 'valor' | 'habilitado' | 'orientation' | 'nivel' | 'posicion'> & {
  unidad: string
  onToggle: () => void
  imageVariant: string
}

function isInNormalRange(value: number | null, id: string) {
  if (value === null) return false
  if (id.substring(0, 1) === "A") return true
  else if (value < -30 || value > 30) return false
  else return true
}

export const DataButton = memo(({
  id, sensorId, valor, habilitado, orientation, nivel = 1, posicion, unidad, onToggle, imageVariant
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
      style={{
        backgroundColor: habilitado ? NIVEL_BG[nivel] ?? NIVEL_BG[1] : undefined,
        borderColor: outOfRangeStyle ? '#8b1e1e' : undefined,
      }}
      className={clsx(
        'items-center rounded-md border lg:whitespace-nowrap sm:w-15 lg:w-20 xl:w-22 2xl:w-25',
        'flex flex-col py-2 px-2 gap-0.2',
        'select-none outline-none transition-colors duration-150',
        habilitado
          ? 'border-green-500/40'
          : 'border-white/10 bg-[#7b7b7b]',
        (id.substring(0, 1) === "A" || !isInAnActiveProcess) ? 'w-17 sm:w-20 lg:w-24 xl:w-27 2xl:w-30 py-2.5 px-2.5 gap-1' : 'active:scale-95',
        id.substring(0, 1) === "A" && 'w-fit!'
      )}
    >
      <span className='flex items-start gap-[2px]'>
        {habilitado && isInNormalRange(valor, id) && (
          <IconDot className="text-green-400 animate-pulse mt-[1px]" />
        )}
        {outOfRangeStyle && (
          <IconDot className="text-[#8b1e1e] mt-[1px]" />
        )}
        <p className={clsx(
          'text-s sm:text-[0.6rem] lg:text-xs align-baseline leading-none font-semibold mb-1',
          habilitado ? 'text-[#d7d7d7]' : 'text-[#c7c7c7]'
        )}>
          {id === 'A01' ? 'AMBIENTE' : id === 'A02' ? 'RETORNO' : id === 'A03' ? 'P. PAL DER' : id === 'A04' ? 'P. VEN.' : id === 'A05' ? 'CAU' : id === 'A06' ? 'P. PAL IZQ' : (
            <>
              {id}
              <span className="hidden short:hidden 2xl:inline"> · {orientation}</span>
            </>
          )}
        </p>
      </span>

      {valor !== null && (isInNormalRange(valor, id) || id.substring(0, 1) == 'A') ? (
        <div className={clsx("flex items-baseline gap-[4px]", (posicion >= 100 && imageVariant === 'H') && 'flex-col')}>
          <span className={clsx(
            'text-lg lg:text-xl  font-bold tabular-nums leading-none',
            habilitado ? 'text-white' : 'text-[#c7c7c7]'
          )}>
            {Number.isInteger(valor) && valor > 10 ? valor : valor.toFixed(1)}
          </span>
          <span className={clsx(
            'text-xxs lg:text-xs font-semibold leading-none',
            habilitado ? 'text-[#d7d7d7]' : 'text-[#c7c7c7]',
            (posicion >= 100 && imageVariant == 'H') && 'text-center w-full'
          )}>
            {unidad}
          </span>
        </div>
      ) : (
        <span className="text-sm lg:text-card-large  leading-none">
          <IconPlug className="text-[#c7c7c7]" />
        </span>
      )}
    </button>
  )
})

DataButton.displayName = 'DataButton'

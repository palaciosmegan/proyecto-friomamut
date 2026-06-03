import { useState, useCallback, memo, useMemo } from 'react'
import { MOCK_SENSORES, type SensorMock, type Fila } from '../mock-data/sensores.mock'
import { DataButton } from './DataButton'

interface DiagramProps {
    title: string
    image: string
    ambienteId: number
}

const FILA_Y: Record<Fila, number> = {
    ext_superior: 0.42,
    int_superior: 0.18,
    int_inferior: 0.58,
    ext_inferior: 0.82,
}

function calcColumnaX(sensores: SensorMock[]): Record<string, number> {
    const xMin = 0.18
    const xMax = 0.78
    const columnas = [...new Set(sensores.map(s => s.columna))].sort()
    const n = columnas.length
    return Object.fromEntries(
        columnas.map((col, i) => [
            col,
            n === 1 ? xMin : xMin + (xMax - xMin) * (i / (n - 1)),
        ])
    )
}

export const Diagram = memo(({ title, image, ambienteId }: DiagramProps) => {
    const [sensores, setSensores] = useState<SensorMock[]>(
        () => MOCK_SENSORES[ambienteId] ?? []
    )

    const colX = useMemo(() => calcColumnaX(sensores), [sensores])

    const handleToggle = useCallback((sensorId: string) => {
        setSensores(prev =>
            prev.map(s => s.id === sensorId ? { ...s, habilitado: !s.habilitado } : s)
        )
    }, [])

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold px-4 py-2 shrink-0">{title}</h2>

            {/* Contenedor relativo — la imagen define las dimensiones,
          los sensores se posicionan sobre ella en porcentajes */}
            <div className="relative w-full flex-1 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full object-contain select-none"
                />

                {sensores.map(s => (
                    <div
                        key={s.id}
                        className="absolute"
                        style={{
                            left: `${colX[s.columna] * 100}%`,
                            top: `${FILA_Y[s.fila] * 100}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <DataButton
                            metric={s.valor}
                            descriptionShortened={s.id}
                            unit="°C"
                            habilitado={s.habilitado}
                            onToggle={() => handleToggle(s.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
})

Diagram.displayName = 'Diagram'
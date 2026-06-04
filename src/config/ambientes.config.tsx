import type { ReactNode } from 'react'
import { ChipStatus } from '../types/ui-types'
import { Chip } from '../ui/Chip'
import { Diagram } from '../ui/Diagram'
import _imagenes from '../assets/imagenes_ambientes.json'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

export type Ambiente = {
  id: number
  label: string
  content: ReactNode
}

export const AMBIENTES: Ambiente[] = [
  {
    id: 1,
    label: 'Túnel 1',
    content: (
      <>
        <Chip status={ChipStatus.LIVE} />
        <Diagram title="Túnel 1" ambienteId={1} image={imagenes[0].imagen} />
      </>
    ),
  },
  {
    id: 2,
    label: 'Túnel 2',
    content: (
      <>
        <Chip status={ChipStatus.RECONNECTING} />
        <Diagram title="Túnel 2" ambienteId={2} image={imagenes[0].imagen} />
      </>
    ),
  },
  {
    id: 3,
    label: 'Túnel 3',
    content: (
      <>
        <Chip status={ChipStatus.ERROR} />
        <Diagram title="Túnel 3" ambienteId={3} image={imagenes[0].imagen} />
      </>
    ),
  },
  {
    id: 4,
    label: 'Túnel 4',
    content: (
      <>
        <Chip status={ChipStatus.LIVE} />
        <Diagram title="Túnel 4" ambienteId={4} image={imagenes[0].imagen} />
      </>
    ),
  },
  {
    id: 5,
    label: 'Túnel 5',
    content: (
      <>
        <Diagram title="Túnel 5" ambienteId={5} image={imagenes[0].imagen} />
      </>
    ),
  }
]
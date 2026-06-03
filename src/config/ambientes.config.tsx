import { ChipStatus } from '../types/ui-types'
import { Chip } from '../ui/Chip'
import { Diagram } from '../ui/Diagram'

export type Ambiente = {
  id: number
  label: string
  content: React.ReactNode
}

export const AMBIENTES: Ambiente[] = [
  {
    id: 1,
    label: 'Túnel 1',
    content: (
      <>
        <Chip status={ChipStatus.LIVE} />
        <Diagram title="Túnel 1" ambienteId={1} image="/tunel.png" />
      </>
    ),
  },
  {
    id: 2,
    label: 'Túnel 2',
    content: (
      <>
        <Chip status={ChipStatus.RECONNECTING} />
        <Diagram title="Túnel 2" ambienteId={2} image="/tunel.png" />
      </>
    ),
  },
  {
    id: 3,
    label: 'Túnel 3',
    content: (
      <>
        <Chip status={ChipStatus.ERROR} />
        <Diagram title="Túnel 3" ambienteId={3} image="/tunel.png" />
      </>
    ),
  },
  {
    id: 4,
    label: 'Túnel 4',
    content: (
      <>
        <Chip status={ChipStatus.LIVE} />
        <Diagram title="Túnel 4" ambienteId={4} image="/tunel.png" />
      </>
    ),
  },
]
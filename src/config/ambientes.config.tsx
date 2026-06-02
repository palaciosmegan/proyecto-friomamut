import { ChipStatus } from "../types/ui-types"
import { Chip } from "../ui/Chip"
import { Diagram } from "../ui/Diagram"

export type Ambiente = {
    id: number
    label: string
    content: React.ReactNode
    imgSrc?: string
}

export const AMBIENTES: Ambiente[] = [
    {
        id: 1, label: 'Tunel 1', 
        content: (
            <> 
                <Chip status={ChipStatus.LIVE} />
                <Diagram title="Primer ambiente" data="This." image="/tunel.png" />
            </>
        )
    },
    {
        id: 2, label: 'Tunel 2', 
        content: (
            <> 
                <Chip status={ChipStatus.RECONNECTING} />
                <Diagram title="Segundo ambiente" data="This." image="/tunel.png" />
            </>
        )
    },
    {
        id: 3, label: 'Tunel 3', 
        content: (
            <> 
                <Chip status={ChipStatus.ERROR} />
                <Diagram title="Tercer ambiente" data="This." image="/tunel.png" />
            </>
        )
    }
];
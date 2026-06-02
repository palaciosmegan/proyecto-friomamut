import { Chip } from "../ui/Chip"
import { DataButton } from "../ui/DataButton"
import { Diagram } from "../ui/Diagram"

export const Home = () => {
    return (
        <div>
            da hom
            <h1>displaying all the components for tEsTiNg</h1>
            <DataButton metric={123} descriptionShortened="shortened desc" unit="°C" />
            <Diagram title="Sample Diagram" data="This." image="/packing-01.png" />
            <Diagram title="Sample Diagram" data="This." image="/tunel.png" />
            <Chip text="En tiempo real" />
        </div>
    )
}

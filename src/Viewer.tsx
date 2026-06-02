import { Nav } from "./ui/Nav"
import { DataButton } from "./ui/DataButton"
import { AMBIENTES } from "./config/ambientes.config"
import { useState } from "react"

export const Viewer = () => {
    const [activeTab, setActiveTab] = useState(AMBIENTES[0].id)
    const active = AMBIENTES.find(a => a.id === activeTab)!

    return (
        <div>
            <Nav TABS={AMBIENTES}
                activeId={activeTab}
                onSelect={setActiveTab} />
            <main>
                <DataButton metric={123} descriptionShortened="shortened desc" unit="°C" />
                {active.content}
            </main>
        </div>
    )
}

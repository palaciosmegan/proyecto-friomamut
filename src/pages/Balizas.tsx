import { useRootData } from '../RootDataContext'
import { Nav } from '../ui/Nav'

export function Balizas() {
  const { ambientes, activeTab, setActiveTab } = useRootData()
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Nav TABS={ambientes} activeId={activeTab} onSelect={setActiveTab} />

      <main className="flex-1 pb-[30px] relative">
        <h1>asdfg</h1>
      </main>
    </div>
  )
}

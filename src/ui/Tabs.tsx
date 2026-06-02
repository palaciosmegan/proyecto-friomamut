import { useState } from 'react'
import { clsx } from 'clsx'

export type TabItem = {
  id: string
  label: string
  content: React.ReactNode
}

type TabsProps = {
  tabs: TabItem[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0].id)
  const current = tabs.find(t => t.id === active)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-1
                      bg-deep border border-[var(--color-border-subtle)]
                      rounded-full px-2 py-1.5 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              active === tab.id
                ? 'bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-raised'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{current?.content}</div>
    </div>
  )
}
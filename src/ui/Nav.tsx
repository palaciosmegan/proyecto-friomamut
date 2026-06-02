import { motion } from 'framer-motion'
import { clsx } from "clsx"
import { useState } from 'react'
import { Diagram } from './Diagram'
import { Chip } from './Chip'

const TABS = [
    {
        id: 1, label: 'Tunel 1', 
        content: (
            <> 
                <Diagram title="Sample Diagram" data="This." image="/tunel.png" />
                <Chip text="En tiempo real" />
            </>
        )
    },
    {
        id: 2, label: 'Tunel 2', 
        content: (
            <> 
                <Diagram title="Sample Diagram" data="This." image="/tunel.png" />
                <Chip text="En tiempo real" />
            </>
        )
    },
]

export const Nav = () => {
    const [activeTab, setActiveTab] = useState(TABS[0].id)
    return (
        <header className="
        w-full min-h-16 p-20
        flex items-center justify-between
        border-b border-[var(--color-border-subtle)]
        shadow-[var(--shadow-card)]
        sticky top-0 z-50
        ">
            <nav className="flex items-center gap-1 bg-[var(--color-deep)] 
                border border-[var(--color-border-subtle)] 
                rounded-full px-2 py-1.5">
                {TABS.map(({id, label}) => (
                <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="relative px-4 py-1.5 rounded-full text-sm font-medium
                       transition-colors duration-200 z-10"
                >
                    {activeTab === id && (
                        <motion.span
                            layoutId="active-tab-pill"
                            className="absolute inset-0 rounded-full
                           bg-[var(--color-text-primary)]"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 35,
                            }}
                        />
                    )}

                    <span className={clsx(
                        'relative z-10 transition-colors duration-200',
                        activeTab === id
                            ? 'text-[var(--color-text-inverse)]'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    )}>
                        {label}
                    </span>
                </button>
                ))}
            </nav>
        </header>
    )
}
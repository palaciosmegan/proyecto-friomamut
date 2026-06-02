import { NavLink, useLocation } from "react-router-dom"
import { motion } from 'framer-motion'
import { clsx } from "clsx"

export const Nav = () => {
    const { pathname } = useLocation()
    console.log(pathname)

    const isActive = (to: string) => pathname === `/${to}`

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
                {[
                    { to: 'lectura/viewer/1', label: 'Packing 1' },
                    { to: 'lectura/viewer/2', label: 'Packing 2' },
                    { to: 'lectura/viewer/3', label: 'Packing 3' },
                ].map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end
                        className="relative px-4 py-1.5 rounded-full text-sm font-medium
                       transition-colors duration-200 z-10"
                    >
                        {isActive(to) && (
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
                            isActive(to)
                                ? 'text-[var(--color-text-inverse)]'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        )}>
                            {label}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}
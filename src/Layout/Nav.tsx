import { NavLink } from "react-router-dom"

export const Nav = () => {
    return (
        <header className="min-h-16 flex flex-col items-center px-4 shadow-md bg-gray-100">
            <nav className="flex items-center gap-1 
                      bg-[var(--color-deep)] 
                      border border-[var(--color-border-subtle)] 
                      rounded-full px-2 py-1.5">
                <NavLink to="/">Packing 1</NavLink>
                <NavLink to="/packing2">Packing 2</NavLink>
                <NavLink to="/packing3">Packing 3</NavLink>
            </nav>
        </header>
    )
}
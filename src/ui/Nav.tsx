import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import type { Ambiente } from "../config/ambientes.config";

interface NavProps {
	TABS: Ambiente[];
	activeId: number;
	onSelect: (id: number) => void;
}

export const Nav = ({ TABS, activeId, onSelect }: NavProps) => {
	return (
		<header
			className="
        w-full mt-10
        flex items-center justify-center
        "
		>
			<nav
				className="flex items-center gap-1 bg-gray-800
                border border-[var(--color-border-subtle)] 
                rounded-full px-2 py-1.5"
			>
				{TABS.map(({ id, label }) => (
					<button
						key={id}
						onClick={() => onSelect(id)}
						className="relative px-4 py-1.5 rounded-full text-sm font-medium
                       transition-colors duration-200 z-10"
					>
						<AnimatePresence>
							{activeId === id && (
								<motion.span
									layoutId="active-tab-pill"
									className="absolute inset-0 rounded-full
                           bg-[var(--color-text-primary)]"
									initial={{ opacity: 0, scale: 0.82 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{
										type: 'spring',
										stiffness: 500,
										damping: 22,
										mass: 0.8,
									}}
								/>
							)}
						</AnimatePresence>

						<span
							className={clsx(
								"relative z-10 transition-colors duration-200",
								activeId === id
									? "text-[var(--color-text-inverse)]"
									: "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
							)}
						>
							{label}
						</span>
					</button>
				))}
			</nav>
		</header>
	);
};

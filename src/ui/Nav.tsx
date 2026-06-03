import { motion } from "framer-motion";
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
        w-full
        flex cente items-center justify-center
        "
		>
			<nav
				className="flex items-center gap-1 bg-[var(--color-deep)] 
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
						{activeId === id && (
							<motion.span
								layoutId="active-tab-pill"
								className="absolute inset-0 rounded-full
                           bg-[var(--color-text-primary)]"
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 35,
								}}
							/>
						)}

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

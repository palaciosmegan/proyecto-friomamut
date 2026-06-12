import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import type { Ambiente } from "../config/ambientes.config";
import { useLocation, useNavigate } from "react-router-dom";

interface NavProps {
	TABS: Ambiente[];
	activeId: number | null;
	onSelect: (id: number) => void;
}

export const Nav = ({ TABS, activeId, onSelect }: NavProps) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	return (
		<header className="w-full my-[30px]">
			<nav className="grid grid-flow-col grid-cols-[1fr_auto_1fr] items-center">
				<div className="sm:ml-4 md:ml-6 lg:ml-8 relative w-fit">
					<select
						className="btn btn-primary appearance-none pr-8 cursor-pointer"
						value={pathname}
						onChange={(e) => navigate(e.target.value)}
					>
						<option value='/'>Túneles</option>
						<option value='/calibradores'>Calibradores</option>
						<option value='/balizas'>Balizas</option>
					</select>
					<svg
						className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
						xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
					>
						<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
					</svg>
				</div>
				<div className="
					flex items-center gap-1 rounded-full px-2 py-1.5
					backdrop-blur-[18px]
					bg-[linear-gradient(135deg,rgba(13,58,110,0.55)_0%,rgba(0,96,100,0.45)_100%)]
					border border-white/14
					shadow-[0_20px_60px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(94,231,223,0.2),inset_0_1px_0_rgba(255,255,255,0.28),0_0_40px_rgba(255,255,255,0.06),0_0_60px_rgba(94,231,223,0.12)]
				">
					{TABS.map(({ id, label }) => (
						<button
							key={id}
							onClick={() => onSelect(id)}
							className="relative px-4 py-1.5 rounded-full text-sm transition-all duration-200 z-10"
						>
							<AnimatePresence>
								{activeId === id && (
									<motion.span
										layoutId="active-tab-pill"
										className="
										absolute inset-0 rounded-full
										bg-white/14
										border border-white/22
										shadow-[0_2px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
									"
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
									"relative z-10 transition-all duration-200 font-semibold",
									activeId === id
										? "text-[var(--color-text-primary)]"
										: "text-[var(--color-text-muted)] font-medium hover:text-[var(--color-text-secondary)] hover:-translate-y-px",
								)}
							>
								{label}
							</span>
						</button>
					))}
				</div>
				<div className="spacer"></div>
			</nav>
		</header>
	);
};

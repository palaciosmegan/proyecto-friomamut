import { clsx } from "clsx";
import type { Ambiente } from "../config/ambientes.config";
import { useLocation, useNavigate } from "react-router-dom";

interface NavProps {
	TABS: Ambiente[];
	activeId: number | null;
	onSelect: (id: number) => void;
	hideTabs?: boolean;
}

export const Nav = ({ TABS, activeId, onSelect, hideTabs }: NavProps) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	return (
		<header className="w-full mb-[20px]">
			<nav className="grid grid-flow-col grid-cols-[1fr_auto_1fr] items-center">
				<div className="spacer"></div>
				{hideTabs ?
					<div className="spacer"></div>
					:
					(
						<div className="
					flex items-center rounded-full px-1 py-1
					backdrop-blur-[18px]
					bg-[linear-gradient(135deg,rgba(13,58,110,0.55)_0%,rgba(0,96,100,0.45)_100%)]
					border border-white/14
					shadow-[0_20px_60px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(94,231,223,0.2),inset_0_1px_0_rgba(255,255,255,0.28),0_0_40px_rgba(255,255,255,0.06),0_0_60px_rgba(94,231,223,0.12)]
					">
							{TABS.map(({ id, label }) => (
								<button
									key={id}
									onClick={() => onSelect(id)}
									className="relative px-5 py-2 rounded-full text-sm transition-all duration-200 z-10"
								>
									<span
										className={clsx(
											"absolute inset-0 rounded-full transition-all duration-200",
											"border border-white/22 shadow-[0_2px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]",
											activeId === id
												? "opacity-100 scale-100 bg-white/14"
												: "opacity-0 scale-90 bg-transparent"
										)}
									/>
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
					)}
				<div className="sm:mr-4 md:mr-6 lg:mr-8 relative w-fit justify-self-end">
					<select
						className="btn btn-primary appearance-none pr-8 cursor-pointer"
						value={pathname}
						onChange={(e) => navigate(e.target.value)}
					>
						<option className="bg-gray-800" value='/'>Túneles</option>
						<option className="bg-gray-800" value='/calibradores'>Calibradores</option>
						<option className="bg-gray-800" value='/balizas'>Balizas</option>
					</select>
					<svg
						className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
						xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
					>
						<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
					</svg>
				</div>
			</nav>
		</header>
	);
};

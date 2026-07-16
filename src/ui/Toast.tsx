import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

interface ToastProps {
	message: string;
	variant: "success" | "error" | "neutral";
	callback: () => void;
}

export const Toast = ({ message, variant, callback }: ToastProps) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const show = requestAnimationFrame(() => setVisible(true))
		return () => cancelAnimationFrame(show)
	}, [])

	const onClose = useCallback(() => {
		setVisible(false)
		setTimeout(callback, 300)
	}, [callback])

	useEffect(() => {
		const id = setTimeout(onClose, 3000)
		return () => clearTimeout(id)
	}, [onClose])

	const progressColor = {
		success: 'bg-green-400',
		error: 'bg-red-400',
		neutral: 'bg-white/40',
	}

	return (
		<div className={clsx(
			"fixed top-8 right-6 z-50 flex flex-col overflow-hidden rounded-xl",
			"border backdrop-blur-md transition-all duration-300",
			"shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
			visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
			variant === 'success' && "bg-green-950/80 border-green-600/50 shadow-[0_0_20px_rgba(0,166,62,0.25)]",
			variant === 'error'   && "bg-red-950/80 border-red-600/50 shadow-[0_0_20px_rgba(166,0,0,0.25)]",
			variant === 'neutral' && "bg-gray-900/80 border-white/10",
		)}>
			<div className="flex items-center gap-3 pl-5 pr-4 py-3">
				<span className={clsx(
					"text-sm font-bold",
					variant === 'success' && "text-green-300",
					variant === 'error'   && "text-red-300",
					variant === 'neutral' && "text-white/70",
				)}>
					{message}
				</span>
				<button type="button" onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors text-base leading-none">
					✕
				</button>
			</div>
			<div
				className={clsx("h-0.5 w-full origin-left", progressColor[variant])}
				style={{ animation: 'toast-progress 3s linear forwards' }}
			/>
		</div>
	);
};

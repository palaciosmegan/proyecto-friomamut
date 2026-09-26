export interface LegendItem {
  label: string
  color: string
}

interface LegendProps {
  items: LegendItem[]
}

export const Legend = ({ items }: LegendProps) => (
  <div className="inline-flex items-center gap-3 px-2.5 py-1.5 rounded-md border border-white/10 bg-[var(--color-abyss)]/85 backdrop-blur-sm text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] select-none">
    {items.map(({ label, color }) => (
      <span key={label} className="inline-flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-[3px] border border-green-500/40" style={{ backgroundColor: color }} />
        {label}
      </span>
    ))}
  </div>
)

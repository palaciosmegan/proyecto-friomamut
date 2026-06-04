export const Message = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full
        bg-[var(--color-raised)] border border-[var(--color-border-default)]
        text-[var(--color-text-muted)] text-sm font-medium tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]" />
        Sin sensores configurados
      </div>
    </div>
  )
}
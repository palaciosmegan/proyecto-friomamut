interface MessageProps {
  text?: string
}

const IconWarning = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className={className}>
    <path d="M2.27,17.01c-0.77,1.33,0.19,3,1.73,3h15.06c1.54,0,2.5-1.67,1.73-3L13.26,4c-0.77-1.33-2.69-1.33-3.46,0L2.27,17.01z M10.53,10.01V13c0,0.55,0.45,1,1,1c0.55,0,1-0.45,1-1v-2.99c0-0.55-0.45-1-1-1C10.98,9.01,10.53,9.46,10.53,10.01z"/>
    <circle cx="11.53" cy="16.01" r="1"/>
  </svg>
)

export const Message = ({ text = 'Sin sensores configurados' }: MessageProps) => {
  return (
    <div className="absolute inset-x-0 top-[30vh] flex justify-center">
      <div
        className="glass-pill gap-3 px-6 py-3"
        style={{ '--glow-r': '255', '--glow-g': '195', '--glow-b': '0' } as React.CSSProperties}
      >
        <IconWarning className="text-[rgba(255,210,80,0.85)]" />
        <span className="text-sm font-semibold tracking-wide text-[rgba(255,230,140,0.9)]">
          {text}
        </span>
      </div>
    </div>
  )
}

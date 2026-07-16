import { IconWarning } from './icons'

interface MessageProps {
  text?: string
}

export const Message = ({ text = 'Sin sensores configurados' }: MessageProps) => {
  return (
    <div className="absolute inset-x-0 top-[30vh] flex justify-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold select-none shadow-sm border bg-amber-50 border-amber-500/40 text-amber-600">
        <IconWarning />
        {text}
      </div>
    </div>
  )
}

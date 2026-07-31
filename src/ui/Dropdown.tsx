import { clsx } from 'clsx'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  className?: string
}

export const Dropdown = ({ value, options, onChange, className }: DropdownProps) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const rafRef = useRef<number | null>(null)
  const [pos, setPos] = useState({ left: 0, top: 0, minWidth: 0, ready: false })

  const selected = options.find(o => o.value === value) ?? options[0]

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return
    const r = trigger.getBoundingClientRect()
    const gap = 8
    const menuH = menu.offsetHeight
    const spaceBelow = window.innerHeight - r.bottom
    const dropUp = spaceBelow < menuH + gap && r.top > spaceBelow
    const top = dropUp ? r.top - menuH - gap : r.bottom + gap

    const minWidth = r.width
    const menuW = Math.max(menu.offsetWidth, minWidth)
    let left = r.left
    if (left + menuW > window.innerWidth - gap) left = window.innerWidth - gap - menuW
    if (left < gap) left = gap

    // Bail out of the state update (and its re-render) when nothing moved.
    setPos(prev =>
      prev.ready && prev.left === left && prev.top === top && prev.minWidth === minWidth
        ? prev
        : { left, top, minWidth, ready: true },
    )
  }, [])

  useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    // Coalesce scroll/resize bursts into one reposition per frame.
    const scheduleReposition = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        updatePosition()
      })
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('scroll', scheduleReposition, true)
    window.addEventListener('resize', scheduleReposition)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      window.removeEventListener('scroll', scheduleReposition, true)
      window.removeEventListener('resize', scheduleReposition)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, updatePosition])

  const handleSelect = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx('btn btn-primary appearance-none cursor-pointer', className)}
      >
        {selected?.label ?? ''}
        <svg
          className={clsx(
            'pointer-events-none shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
          xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </button>

      {open && createPortal(
        <ul
          ref={menuRef}
          role="listbox"
          className="fixed z-[100] max-h-[60vh] overflow-auto rounded-xl border border-white/14 bg-[rgba(13,30,50,0.98)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          style={{ left: pos.left, top: pos.top, minWidth: pos.minWidth, visibility: pos.ready ? 'visible' : 'hidden' }}
        >
          {options.map(o => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => handleSelect(o.value)}
              className={clsx(
                'cursor-pointer px-4 py-2 text-sm transition-colors',
                o.value === value
                  ? 'bg-white/14 text-white font-semibold'
                  : 'text-white/70',
              )}
            >
              {o.label}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </>
  )
}

import { useRef, useEffect } from 'react'

const MAX_DIST = 55
const GOLD = '196, 152, 58'

/**
 * variant="line"  → bottom-border only, glow changes its color
 * variant="box"   → thin box border, radial gradient glows from cursor direction
 */
export default function GlowInput({ variant = 'line', className = '', inputClassName = '', ...props }) {
  const inputRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    function onMove(e) {
      const target = variant === 'box' ? wrapRef.current : inputRef.current
      if (!target) return

      const rect = target.getBoundingClientRect()
      const nearX = Math.max(rect.left, Math.min(e.clientX, rect.right))
      const nearY = Math.max(rect.top, Math.min(e.clientY, rect.bottom))
      const dist = Math.hypot(e.clientX - nearX, e.clientY - nearY)
      const intensity = Math.max(0, 1 - dist / MAX_DIST)

      if (variant === 'line') {
        const inp = inputRef.current
        if (!inp) return
        const alpha = 0.18 + intensity * 0.82
        inp.style.borderBottomColor = `rgba(${GOLD}, ${alpha})`
        inp.style.boxShadow = intensity > 0.05
          ? `0 1px 0 rgba(${GOLD}, ${intensity * 0.22})`
          : 'none'
      } else {
        const wrap = wrapRef.current
        if (!wrap) return
        const x = ((nearX - rect.left) / rect.width) * 100
        const y = ((nearY - rect.top) / rect.height) * 100
        wrap.style.background = intensity > 0.02
          ? `radial-gradient(ellipse at ${x}% ${y}%, rgba(${GOLD}, ${intensity * 0.95}), #2a2a24 60%)`
          : '#2a2a24'
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [variant])

  if (variant === 'box') {
    return (
      <div
        ref={wrapRef}
        style={{ padding: '1.5px', background: '#2a2a24', transition: 'background 0.1s' }}
        className={className}
      >
        <input
          ref={inputRef}
          className={`block w-full bg-[#1c1c19] outline-none ${inputClassName}`}
          {...props}
        />
      </div>
    )
  }

  return (
    <input
      ref={inputRef}
      className={`block w-full bg-transparent outline-none ${className}`}
      style={{ borderBottom: '1.5px solid rgba(196,152,58,0.18)', transition: 'border-color 0.12s, box-shadow 0.12s' }}
      {...props}
    />
  )
}

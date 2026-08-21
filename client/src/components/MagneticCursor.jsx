import { useEffect, useRef } from 'react'

export default function MagneticCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined
    const dot = dotRef.current
    const ring = ringRef.current
    let x = -100, y = -100, rx = -100, ry = -100
    let raf = 0
    const move = (event) => { x = event.clientX; y = event.clientY }
    const loop = () => {
      rx += (x - rx) * 0.14; ry += (y - ry) * 0.14
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const enter = (event) => { const target = event.target.closest('a,button,.magnetic,[data-cursor]'); if (!target) return; ring.classList.add('is-active'); if (target.dataset.cursor) ring.dataset.label = target.dataset.cursor }
    const leave = (event) => { if (!event.relatedTarget?.closest?.('a,button,.magnetic,[data-cursor]')) { ring.classList.remove('is-active'); delete ring.dataset.label } }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', enter)
    window.addEventListener('pointerout', leave)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', enter); window.removeEventListener('pointerout', leave); cancelAnimationFrame(raf) }
  }, [])
  return <><span ref={dotRef} className="gwm-cursor-dot" aria-hidden="true" /><span ref={ringRef} className="gwm-cursor-ring" aria-hidden="true" /></>
}

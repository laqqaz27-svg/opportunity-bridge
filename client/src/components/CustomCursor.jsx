import { useEffect, useRef, useState } from 'react'

function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!supportsFinePointer || prefersReducedMotion) {
      setEnabled(false)
      return
    }

    setEnabled(true)

    const handleMove = (event) => {
      if (!ringRef.current || !dotRef.current) {
        return
      }

      ringRef.current.style.left = `${event.clientX}px`
      ringRef.current.style.top = `${event.clientY}px`
      dotRef.current.style.left = `${event.clientX}px`
      dotRef.current.style.top = `${event.clientY}px`
    }

    const handleOver = (event) => {
      const target = event.target

      if (!(target instanceof Element)) {
        if (ringRef.current && dotRef.current) {
          ringRef.current.classList.remove('is-pointer')
          dotRef.current.classList.remove('is-pointer')
        }
        return
      }

      const points = target.closest('a, button, [role="button"], input, textarea, select, .magnetic-btn')
      if (ringRef.current && dotRef.current) {
        ringRef.current.classList.toggle('is-pointer', Boolean(points))
        dotRef.current.classList.toggle('is-pointer', Boolean(points))
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseover', handleOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor-ring"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot"
      />
    </>
  )
}

export default CustomCursor

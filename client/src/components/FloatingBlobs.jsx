import { useEffect, useRef } from 'react'

const particles = [
  { size: 6, left: 6, top: 12, delay: '0s', duration: '16s' },
  { size: 5, left: 14, top: 64, delay: '1.8s', duration: '19s' },
  { size: 4, left: 22, top: 34, delay: '0.6s', duration: '17s' },
  { size: 7, left: 28, top: 78, delay: '2.4s', duration: '22s' },
  { size: 4, left: 36, top: 16, delay: '1.1s', duration: '18s' },
  { size: 5, left: 43, top: 56, delay: '0.2s', duration: '20s' },
  { size: 6, left: 50, top: 26, delay: '1.6s', duration: '21s' },
  { size: 4, left: 58, top: 70, delay: '0.8s', duration: '17s' },
  { size: 5, left: 65, top: 42, delay: '2s', duration: '23s' },
  { size: 7, left: 72, top: 84, delay: '0.9s', duration: '20s' },
  { size: 4, left: 80, top: 14, delay: '2.1s', duration: '19s' },
  { size: 6, left: 86, top: 60, delay: '1.3s', duration: '24s' },
  { size: 5, left: 92, top: 30, delay: '0.5s', duration: '18s' },
]

function FloatingBlobs() {
  const layerRef = useRef(null)

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!supportsFinePointer || prefersReducedMotion || !layerRef.current) {
      return
    }

    const layer = layerRef.current
    let frameId = null

    const handleMove = (event) => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      frameId = requestAnimationFrame(() => {
        const x = ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3)
        const y = ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3)
        layer.style.setProperty('--ambient-mx', x)
        layer.style.setProperty('--ambient-my', y)
      })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <div ref={layerRef} className="ambient-layer" aria-hidden="true">
      <span className="ambient-mesh" />
      <span className="ambient-blob ambient-blob--one" />
      <span className="ambient-blob ambient-blob--two" />
      <span className="ambient-blob ambient-blob--three" />
      <div className="ambient-particles">
        {particles.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className="ambient-particle"
            style={{
              '--particle-size': `${particle.size}px`,
              '--particle-left': `${particle.left}%`,
              '--particle-top': `${particle.top}%`,
              '--particle-delay': particle.delay,
              '--particle-duration': particle.duration,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default FloatingBlobs

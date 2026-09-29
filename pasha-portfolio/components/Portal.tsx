'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

const SEEN = 'pasha-portal-seen'
const RING = 132 // diameter awal cincin (px)

// Pintu portal: cincin cahaya berputar di tengah, lalu membesar menelan layar dan
// "menembus" ke halaman utama. Warna ambil dari tema aktif (--accent, --accent2, --bg).
export default function Portal() {
  const path = usePathname()
  const [show, setShow] = useState(path === '/')
  const r = useMotionValue(0) // radius lubang (px)
  const glow = useMotionValue(0)

  // lubang di overlay: transparan di dalam radius r, warna --bg di luar
  const mask = useTransform(r, v => `radial-gradient(circle at 50% 50%, transparent ${v}px, #000 ${v + 2}px)`)
  const ringScale = useTransform(r, v => Math.max(1, (v * 2) / RING))
  const ringOpacity = useTransform(r, [0, 240, 900], [1, 1, 0])
  const glowOpacity = useTransform(glow, v => v)

  useEffect(() => {
    if (path !== '/') return setShow(false)
    let seen = false
    try { seen = sessionStorage.getItem(SEEN) === '1' } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduce) return setShow(false)
    try { sessionStorage.setItem(SEEN, '1') } catch {}

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const far = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80
    const a = animate(glow, [0, 1, 1], { duration: 1.5, times: [0, 0.5, 1] })
    // fase 1: berputar ~1,2 dtk. fase 2: membesar menelan layar
    const b = animate(r, [0, RING / 2, far], { duration: 2.3, times: [0, 0.5, 1], ease: [0.6, 0, 0.3, 1] })
    const done = b.then(() => setShow(false))
    return () => {
      a.stop(); b.stop(); void done
      document.body.style.overflow = prev
    }
  }, [path, r, glow])

  if (!show) return null

  const skip = () => { r.stop(); setShow(false); document.body.style.overflow = '' }

  return (
    <motion.div className="portal" style={{ WebkitMaskImage: mask, maskImage: mask }} onClick={skip} role="presentation" aria-hidden="true">
      <motion.div className="portal-glow" style={{ opacity: glowOpacity }} />
      <motion.div className="portal-ring" style={{ scale: ringScale, opacity: ringOpacity, width: RING, height: RING }}>
        <span className="portal-spin" />
        <span className="portal-core" />
      </motion.div>
    </motion.div>
  )
}

import type { Variants } from 'framer-motion'

// tipe Variants supaya 'easeOut' dibaca sebagai easing valid
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

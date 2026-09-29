'use client'
import { motion } from 'framer-motion'

// transisi halus tiap pindah halaman (opacity saja, biar posisi elemen fixed tetap aman)
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

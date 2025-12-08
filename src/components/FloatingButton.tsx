'use client'

import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

export default function FloatingButton() {
  return (
    <motion.a
      href="https://forms.office.com/r/L3wgqx1vsM"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-4 right-64 z-40 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A9ED0] to-[#7B2D3D] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-outfit text-sm md:text-base font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Info size={20} />
      <span>Request Information</span>
    </motion.a>
  )
}

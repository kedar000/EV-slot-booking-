'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function CTA() {
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(34, 197, 94)" },
    tap: { scale: 0.95 }
  }

  return (
    <section className="cta bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Zap size={40} className="mr-2" />
          Ready to Simplify Your EV Charging?
        </motion.h2>
        <motion.p 
          className="text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join thousands of satisfied EV owners and experience hassle-free charging today.
        </motion.p>
        <motion.button 
          className="px-8 py-4 bg-white text-green-600 rounded-full text-lg font-semibold hover:bg-green-100 transition-colors duration-300 flex items-center mx-auto"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Zap size={24} className="mr-2" />
          Start Charging Smarter
        </motion.button>
      </div>
    </section>
  )
}


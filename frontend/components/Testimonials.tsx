'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    { name: "Emily Chen", role: "Daily Commuter", quote: "This app has revolutionized my daily charging routine. I never have to worry about finding an available station anymore." },
    { name: "Michael Johnson", role: "EV Enthusiast", quote: "The ability to book charging slots in advance has been a game-changer for my long-distance trips. Highly recommended!" },
    { name: "Sarah Thompson", role: "Busy Professional", quote: "The real-time availability feature saves me so much time. I can plan my charging stops efficiently during my workday." },
    { name: "David Rodriguez", role: "Ride-Share Driver", quote: "As an EV ride-share driver, this app helps me stay charged and on the road. The subscription plan is perfect for my needs." },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  return (
    <section id="testimonials" className="testimonials py-20 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our EV Drivers Say
        </motion.h2>
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-green-100 dark:border-gray-700"
              variants={itemVariants}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 italic text-gray-600 dark:text-gray-300">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                ></motion.div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


'use client'

import { motion } from 'framer-motion'
import { Zap, Clock, MapPin, Shield } from 'lucide-react'
import Image from 'next/image'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function Hero() {
  const benefits = [
    { icon: <Zap size={24} />, text: "Fast Charging" },
    { icon: <Clock size={24} />, text: "24/7 Availability" },
    { icon: <MapPin size={24} />, text: "Nationwide Network" },
    { icon: <Shield size={24} />, text: "Secure Booking" },
  ]

  return (
    <section className="hero relative bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 dark:from-green-900 dark:via-teal-900 dark:to-blue-900 text-white py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className={`${poppins.className} text-4xl md:text-6xl font-extrabold mb-6 leading-tight`}
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #ffffff, #22d3ee, #ffffff)',
                backgroundSize: '200% auto',
              }}
            >
              Charge Your Journey with EV Slot
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-green-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Book EV charging slots effortlessly. Power up your ride, anytime, anywhere.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <span className="mr-2 text-green-300">{benefit.icon}</span>
                  <span className="text-sm font-semibold">{benefit.text}</span>
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button 
                className="px-8 py-4 bg-white text-green-600 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:bg-green-100 hover:text-green-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Slot Now
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl"
                animate={{
                  boxShadow: ['0px 0px 0px rgba(34,197,94,0.3)', '0px 0px 50px rgba(34,197,94,0.7)', '0px 0px 0px rgba(34,197,94,0.3)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <Image
                src="/placeholder.svg"
                alt="EV Charging Station"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </section>
  )
}


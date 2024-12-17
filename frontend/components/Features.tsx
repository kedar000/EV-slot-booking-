'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Battery, Clock, MapPin, CreditCard, Calendar, Zap, Shield, Leaf } from 'lucide-react'

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    { icon: <Battery size={40} />, title: "Smart Charging", description: "Optimize your charging schedule based on your vehicle's needs and electricity rates." },
    { icon: <Clock size={40} />, title: "Real-time Availability", description: "View live updates on charging station availability and estimated wait times." },
    { icon: <MapPin size={40} />, title: "Extensive Network", description: "Access our wide network of charging stations across the country." },
    { icon: <CreditCard size={40} />, title: "Seamless Payments", description: "Easy and secure payment options, including subscription plans for frequent users." },
    { icon: <Calendar size={40} />, title: "Advanced Booking", description: "Reserve your charging slot in advance to ensure availability." },
    { icon: <Zap size={40} />, title: "Multi-speed Charging", description: "Choose from various charging speeds to suit your needs and time constraints." },
    { icon: <Shield size={40} />, title: "Charging Protection", description: "Our smart system ensures optimal charging to protect your EV's battery life." },
    { icon: <Leaf size={40} />, title: "Green Energy Option", description: "Option to charge your EV using renewable energy sources where available." },
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
    <section id="features" className="features py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features for EV Owners
        </motion.h2>
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-green-100 dark:border-gray-700"
              variants={itemVariants}
            >
              <motion.div 
                className="text-green-500 dark:text-green-400 mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


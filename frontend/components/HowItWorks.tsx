'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, CalendarCheck, Zap, CarFront } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    { icon: <Search size={40} />, title: "Find a Station", description: "Use our app to locate the nearest available charging station." },
    { icon: <CalendarCheck size={40} />, title: "Book Your Slot", description: "Reserve a charging slot that fits your schedule." },
    { icon: <Zap size={40} />, title: "Charge Your EV", description: "Plug in your vehicle and start charging." },
    { icon: <CarFront size={40} />, title: "Hit the Road", description: "Unplug and continue your journey with a fully charged EV." },
  ]

  return (
    <section id="how-it-works" className="how-it-works py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
          How Our EV Charging Slot Booking Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { once: true, amount: 0.2 });

            return (
              <motion.div
                key={index}
                ref={ref}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-green-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white flex items-center justify-center text-2xl font-bold mb-4"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1, rotateY: 360 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}


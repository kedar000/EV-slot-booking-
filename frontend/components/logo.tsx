import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  width?: number
  height?: number
  isDarkMode?: boolean
}

export default function EVSlotLogo({ width = 50, height = 50, isDarkMode = false }: LogoProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      {/* Car body */}
      <motion.path
        d="M10 70 H90 V50 C90 40 80 35 70 35 H30 C20 35 10 40 10 50 V70 Z"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      {/* Wheels */}
      <motion.circle cx="30" cy="70" r="10" stroke={isDarkMode ? "#E0E0E0" : "#4A5568"} strokeWidth="4" variants={pathVariants} />
      <motion.circle cx="70" cy="70" r="10" stroke={isDarkMode ? "#E0E0E0" : "#4A5568"} strokeWidth="4" variants={pathVariants} />
      {/* Electric plug */}
      <motion.path
        d="M45 35 V15 M55 35 V15 M40 15 H60"
        stroke={isDarkMode ? "#22C55E" : "#22C55E"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      {/* Lightning bolt */}
      <motion.path
        d="M50 50 L40 60 H50 L45 70"
        stroke={isDarkMode ? "#22C55E" : "#22C55E"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
    </motion.svg>
  )
}


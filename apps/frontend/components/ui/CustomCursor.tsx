'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const outerX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 })
  const outerY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 })

  useEffect(() => {
    setMounted(true)

    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(
        !!target.closest('a, button, [role="button"], input, textarea, select, label')
      )
    }

    window.addEventListener('mousemove', handleMouse)
    document.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <>
      {/* Outer ring: spring-delayed follow */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1px solid #B8965A',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isHovering ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      {/* Inner dot: instant follow */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          backgroundColor: '#B8965A',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        animate={{ opacity: isHovering ? 0 : 1, scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}

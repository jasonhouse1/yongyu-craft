'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function RingHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightPos, setLightPos] = useState({ x: 50, y: 30 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 80,
    damping: 25,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 80,
    damping: 25,
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width)
      mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height)
      setLightPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#080706',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Mouse-following radial light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(600px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.055), transparent 70%)`,
          transition: 'background 0.3s ease',
          zIndex: 1,
        }}
      />

      {/* Vertical light line from top center */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
          style={{
            width: '1px',
            height: '38vh',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.65), transparent)',
            transformOrigin: 'top',
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: '1rem',
            letterSpacing: '0.15em',
            color: '#C4A45A',
          }}
        >
          永裕工藝
        </span>
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {[
            { href: '/works', label: '作品' },
            { href: '/about', label: '關於' },
            { href: '/contact', label: '聯絡' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: '0.8125rem',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 300,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Ring: perspective wrapper → entry → float → tilt */}
      <div style={{ perspective: '1200px', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 5,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: 2.0,
            }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
            >
              <Image
                src="/images/works/lumiere-ring/main.png"
                alt="Lumière Ring"
                width={520}
                height={456}
                priority
                style={{
                  objectFit: 'contain',
                  filter:
                    'drop-shadow(0 8px 40px rgba(255,255,255,0.12)) drop-shadow(0 0 80px rgba(180,150,100,0.08))',
                  maxWidth: '90vw',
                  maxHeight: '55vh',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Text block: brand + subtitle + CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            letterSpacing: '0.2em',
            margin: 0,
          }}
        >
          永裕工藝
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.18em',
            margin: 0,
            fontWeight: 300,
          }}
        >
          每一道工序，都承載著心意
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8, ease: 'easeOut' }}
          style={{ marginTop: '0.5rem' }}
        >
          <Link
            href="/works"
            style={{
              display: 'inline-block',
              padding: '0.7rem 2.5rem',
              border: '1px solid rgba(255,255,255,0.25)',
              fontSize: '0.8125rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 300,
            }}
          >
            探索作品
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

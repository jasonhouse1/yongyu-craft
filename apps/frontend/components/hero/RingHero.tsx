'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const BRAND_CHARS = ['永', '裕', '工', '藝']

export default function RingHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightPos, setLightPos] = useState({ x: 50, y: 40 })
  const [isRingHovered, setIsRingHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 80,
    damping: 25,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
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
      className="hero-bg"
      style={{
        background: `
          radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 60px,
            rgba(196,154,90,0.012) 60px,
            rgba(196,154,90,0.012) 61px
          ),
          #080706
        `,
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient mouse-following glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(900px circle at ${lightPos.x}% ${lightPos.y}%, rgba(196,154,90,0.04), transparent 65%)`,
          transition: 'background 0.4s ease',
          zIndex: 1,
        }}
      />

      {/* Top elliptical gold halo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 2.0 }}
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '500px',
          background:
            'radial-gradient(ellipse 300px 500px at 50% -10%, rgba(196,154,90,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Side light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 200px 600px at 75% 40%, rgba(196,154,90,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Ground reflection light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 400px 80px at 50% 85%, rgba(196,154,90,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Left: YY logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        style={{ position: 'absolute', top: '1.75rem', left: '2.5rem', zIndex: 20 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: '1rem',
            letterSpacing: '0.3em',
            color: '#C49A5A',
            fontWeight: 300,
          }}
        >
          YY
        </span>
      </motion.div>

      {/* Right: navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        style={{
          position: 'absolute',
          top: '1.75rem',
          right: '2.5rem',
          zIndex: 20,
          display: 'flex',
          gap: '2.5rem',
        }}
      >
        {[
          { href: '/works', label: '作品' },
          { href: '/about', label: '關於' },
          { href: '/contact', label: '聯絡' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link-hero"
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              color: '#C8C4BE',
              fontWeight: 300,
            }}
          >
            {item.label}
          </Link>
        ))}
      </motion.nav>

      {/* Ring + reflection */}
      <div style={{ perspective: '1200px', zIndex: 10, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, delay: 5.0 }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              animate={{ scale: isRingHovered ? 1.02 : 1 }}
              transition={{ duration: 0.4 }}
              onHoverStart={() => setIsRingHovered(true)}
              onHoverEnd={() => setIsRingHovered(false)}
            >
              {/* Main ring with mask removal */}
              <div
                style={{
                  position: 'relative',
                  WebkitMaskImage: "url('/images/works/lumiere-ring/alpha-inverted.png')",
                  maskImage: "url('/images/works/lumiere-ring/alpha-inverted.png')",
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              >
                <Image
                  src="/images/works/lumiere-ring/main.png"
                  alt="Lumière Ring"
                  width={371}
                  height={326}
                  priority
                  style={{
                    height: '65vh',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 16px 60px rgba(196,154,90,0.18))',
                  }}
                />
                {/* Moving light on ring */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 55% 55% at ${lightPos.x}% ${lightPos.y}%, rgba(255,242,210,0.1), transparent 70%)`,
                    transition: 'background 0.15s ease',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>

              {/* Reflection */}
              <div style={{ position: 'relative', marginTop: '-20%' }}>
                <Image
                  src="/images/works/lumiere-ring/main.png"
                  alt=""
                  aria-hidden
                  width={371}
                  height={326}
                  style={{
                    height: '65vh',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    transform: 'scaleY(-1)',
                    opacity: 0.08,
                    filter: 'blur(12px)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70%',
                    background: 'linear-gradient(to bottom, transparent, #080706)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom layout */}
      <div
        style={{
          position: 'absolute',
          bottom: '3.5rem',
          left: 0,
          right: 0,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'flex-end',
          padding: '0 2.5rem',
          zIndex: 20,
        }}
      >
        {/* Left: brand name char by char */}
        <div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {BRAND_CHARS.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.0 + i * 0.3, duration: 0.8, ease: 'easeOut' }}
                style={{
                  fontFamily: 'var(--font-noto-serif-tc)',
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  fontWeight: 300,
                  color: '#E8ECF0',
                  letterSpacing: '0.6em',
                  display: 'block',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle layer 1 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6.5, duration: 1.0 }}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: '#9A9590',
              fontWeight: 300,
              margin: '0 0 1rem',
            }}
          >
            YONGYU CRAFT · 台灣手工金工
          </motion.p>

          {/* Gold line expanding from left */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 6.8, duration: 1.4, ease: 'easeOut' }}
            style={{
              height: '1px',
              width: '160px',
              background: '#C49A5A',
              transformOrigin: 'left',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Center: SCROLL with SVG mouse icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7.0, duration: 1.0 }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <div style={{ animation: 'scrollHint 2s ease-in-out infinite' }}>
            <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
              <path
                d="M12 2C9.8 2 8 3.8 8 6v14c0 2.2 1.8 4 4 4s4-1.8 4-4V6c0-2.2-1.8-4-4-4z"
                stroke="#C49A5A" strokeWidth="1" fill="none" opacity="0.6"
              />
              <path
                d="M4 16v6c0 5.5 4 10 8 10s8-4.5 8-10v-6"
                stroke="#C49A5A" strokeWidth="1" fill="none" opacity="0.4"
              />
            </svg>
          </div>
          <span style={{ color: '#C49A5A', fontSize: '0.55rem', letterSpacing: '0.4em', fontWeight: 300, opacity: 0.5 }}>
            SCROLL
          </span>
        </motion.div>

        {/* Right: subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.2, duration: 1.2 }}
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.16em',
            color: 'rgba(255,255,255,0.2)',
            fontWeight: 300,
            margin: 0,
            textAlign: 'right',
            lineHeight: 1.9,
          }}
        >
          Handcrafted Goldsmithing
          <br />
          Est. Taiwan
        </motion.p>
      </div>
    </div>
  )
}

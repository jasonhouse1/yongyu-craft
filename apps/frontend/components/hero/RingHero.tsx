'use client'

import { useEffect, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import Link from 'next/link'

const BRAND_CHARS = ['永', '裕', '工', '藝']

/** Facet-star sparkle: a 4-point cross + a thin X, pulsing from nothing. */
function Sparkle({ cx, cy, s, delay, rot = 0 }: { cx: number; cy: number; s: number; delay: number; rot?: number }) {
  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.4] }}
      transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 4.2, ease: 'easeOut' }}
    >
      <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
        {/* long 4-point star */}
        <path d="M0 -60 L5 -6 L60 0 L5 6 L0 60 L-5 6 L-60 0 L-5 -6 Z" fill="#FFFFFF" opacity="0.95" />
        {/* short diagonal */}
        <path d="M0 -26 L3 -3 L26 0 L3 3 L0 26 L-3 3 L-26 0 L-3 -3 Z" fill="#EAF2FF" opacity="0.8" transform="rotate(45)" />
        <circle r="3.5" fill="#FFFFFF" />
      </g>
    </motion.g>
  )
}

function Diamond() {
  return (
    <g>
      {/* prongs / setting on the band */}
      <path d="M452 300 L446 324 M548 300 L554 324 M500 292 L500 322" stroke="#C49A5A" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="500" cy="322" rx="34" ry="9" fill="#8C6E42" opacity="0.7" />
      {/* brilliant-cut diamond */}
      <polygon points="470,268 530,268 560,296 500,350 440,296" fill="url(#diaGrad)" stroke="#F4F9FF" strokeWidth="1.3" />
      <line x1="440" y1="296" x2="560" y2="296" stroke="#F4F9FF" strokeWidth="1" opacity="0.75" />
      <line x1="470" y1="268" x2="530" y2="268" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="470" y1="268" x2="452" y2="296" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
      <line x1="530" y1="268" x2="548" y2="296" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
      <line x1="470" y1="268" x2="500" y2="296" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
      <line x1="530" y1="268" x2="500" y2="296" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
      <line x1="440" y1="296" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.5" />
      <line x1="560" y1="296" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.5" />
      <line x1="500" y1="296" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
      <line x1="470" y1="296" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
      <line x1="530" y1="296" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
    </g>
  )
}

/** The gold band (open centre). */
function Band() {
  return (
    <g>
      <circle cx="500" cy="500" r="200" fill="none" stroke="#241b10" strokeWidth="2" />
      <circle cx="500" cy="500" r="170" fill="none" stroke="#241b10" strokeWidth="2" />
      <circle cx="500" cy="500" r="185" fill="none" stroke="url(#bandGold)" strokeWidth="30" />
      <circle cx="500" cy="500" r="197" fill="none" stroke="rgba(251,235,200,0.4)" strokeWidth="1.2" />
      <circle cx="500" cy="500" r="173" fill="none" stroke="rgba(94,69,38,0.8)" strokeWidth="1.2" />
    </g>
  )
}

const defs = (
  <defs>
    <linearGradient id="bandGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F2DCAC" />
      <stop offset="0.5" stopColor="#C49A5A" />
      <stop offset="1" stopColor="#5E4526" />
    </linearGradient>
    <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F2F8FF" />
      <stop offset="0.5" stopColor="#C4D4EC" />
      <stop offset="1" stopColor="#93A9C8" />
    </linearGradient>
    <radialGradient id="heroGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="rgba(232,206,150,0.3)" />
      <stop offset="1" stopColor="rgba(232,206,150,0)" />
    </radialGradient>
  </defs>
)

export default function RingHero() {
  const [memberPath, setMemberPath] = useState('/member/login')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('yyc_member_token')) setMemberPath('/member')
  }, [])
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="hero-bg" style={{ height: '100vh', background: '#080706' }} aria-hidden />
  }

  return (
    <MotionConfig reducedMotion="never">
      <div
        className="hero-bg"
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(ellipse at 50% 46%, rgba(196,154,90,0.10) 0%, transparent 56%),
            radial-gradient(ellipse at center, transparent 54%, rgba(0,0,0,0.6) 100%),
            #080706
          `,
        }}
      >
        {/* Nav */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
          style={{ position: 'absolute', top: '1.6rem', left: '2.6rem', zIndex: 30 }}>
          <span style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: '1rem', letterSpacing: '0.3em', color: '#C49A5A', fontWeight: 300 }}>YY</span>
        </motion.div>
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
          style={{ position: 'absolute', top: '1.6rem', right: '2.6rem', zIndex: 30, display: 'flex', gap: '2.4rem' }}>
          {[{ href: '/works', label: '作品' }, { href: '/about', label: '關於' }, { href: '/contact', label: '聯絡' }, { href: memberPath, label: '會員' }].map((it) => (
            <Link key={it.label} href={it.href} className="nav-link-hero" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: '#C8C4BE', fontWeight: 300 }}>{it.label}</Link>
          ))}
        </motion.nav>

        {/* ── One single ring: plays the cinematic intro centred, then shrinks + slides left
               into the logo emblem (never a second ring on screen) ── */}
        <div
          className="hero-split"
          style={{
            position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 'clamp(1.6rem, 6vw, 5rem)',
            width: '100%', maxWidth: 1080, padding: '0 2.5rem', marginTop: '-2vh',
          }}
        >
          {/* left slot — the ONE ring morphs from centre-huge to this emblem */}
          <div style={{ width: 'clamp(190px, 25vw, 330px)', flexShrink: 0, perspective: 1400, position: 'relative', zIndex: 10 }}>
            <motion.div
              initial={{ x: 210, scale: 0.08, rotateY: 0 }}
              animate={{ x: [210, 210, 0], scale: [0.08, 9, 1.5, 1.5, 1], rotateY: [0, 0, 360, 360] }}
              transition={{
                x: { duration: 7.2, times: [0, 0.82, 0.96], ease: [0.5, 0, 0.3, 1] },
                scale: { duration: 7.2, times: [0, 0.14, 0.28, 0.82, 0.96], ease: 'easeInOut' },
                rotateY: { duration: 7.2, times: [0, 0.28, 0.44, 1], ease: [0.5, 0, 0.2, 1] },
              }}
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
            >
              <svg viewBox="0 0 1000 1000" width="100%" style={{ overflow: 'visible', display: 'block' }}>
                {defs}
                <circle cx="500" cy="500" r="250" fill="url(#heroGlow)" />
                <Band />

                {/* diamond drops in and lands in the setting (after the spin) */}
                <motion.g
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  initial={{ opacity: 0, y: -260, rotate: 520, scale: 1.7 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{ delay: 3.2, duration: 1.15, ease: [0.3, 1.25, 0.5, 1] }}
                >
                  <Diamond />
                </motion.g>

                {/* designed facet sparkles (3 staggered bursts, varied angle) */}
                <Sparkle cx={500} cy={300} s={1.0} delay={4.3} rot={0} />
                <Sparkle cx={500} cy={300} s={0.7} delay={4.75} rot={24} />
                <Sparkle cx={500} cy={300} s={1.15} delay={5.2} rot={-16} />
              </svg>
            </motion.div>
          </div>

          {/* right: brand + headline + tagline (fades in as the ring settles into the emblem) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6.3, duration: 0.9 }}
            style={{ maxWidth: 440 }}
          >
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem' }}>
              {BRAND_CHARS.map((ch, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 6.6 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
                  style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)', fontWeight: 300, color: '#F0EBE0', letterSpacing: '0.32em', display: 'block' }}>
                  {ch}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.1, duration: 0.8 }}
              style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', color: '#E8ECF0', letterSpacing: '0.12em', lineHeight: 1.9, marginBottom: '1.3rem', fontWeight: 300 }}>
              每一枚，皆為此刻而生
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.4, duration: 0.8 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ width: 30, height: 1, background: 'rgba(196,154,90,0.6)' }} />
              <span style={{ fontFamily: 'var(--font-noto-sans-tc, sans-serif)', fontSize: '0.92rem', letterSpacing: '0.24em', color: 'rgba(196,154,90,0.9)', fontWeight: 300 }}>
                台灣手工金工 · 手工訂製
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8.2, duration: 1 }}
          style={{ position: 'absolute', bottom: '2.2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-noto-sans-tc)', color: 'rgba(196,154,90,0.6)', fontSize: '0.55rem', letterSpacing: '0.4em' }}>SCROLL</span>
          <div style={{ animation: 'scrollHint 2s ease-in-out infinite' }}>
            <svg width="20" height="30" viewBox="0 0 24 36" fill="none">
              <path d="M12 2C9.8 2 8 3.8 8 6v14c0 2.2 1.8 4 4 4s4-1.8 4-4V6c0-2.2-1.8-4-4-4z" stroke="#C49A5A" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M4 16v6c0 5.5 4 10 8 10s8-4.5 8-10v-6" stroke="#C49A5A" strokeWidth="1" fill="none" opacity="0.35" />
            </svg>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  )
}

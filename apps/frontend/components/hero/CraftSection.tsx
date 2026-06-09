'use client'

import { motion } from 'framer-motion'

const ITEMS = [
  { text: '十八克拉', dir: 'left' as const },
  { text: '三週鍛造', dir: 'right' as const },
  { text: '一件傳世', dir: 'left' as const },
]

export default function CraftSection() {
  return (
    <section
      style={{
        backgroundColor: '#080706',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Global brushed texture base layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/works/lumiere-ring/detail-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              padding: '2.5rem 0',
              overflow: 'hidden',
            }}
          >
            {/* Per-line texture highlight */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.07,
                pointerEvents: 'none',
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 2.0 }}
                style={{
                  height: '100%',
                  backgroundImage: 'url(/images/works/lumiere-ring/detail-2.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${i * 33}%`,
                }}
              />
            </div>

            {/* Main text */}
            <motion.div
              initial={{ opacity: 0, x: item.dir === 'left' ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-noto-serif-tc)',
                  fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.88)',
                  letterSpacing: '0.06em',
                  display: 'block',
                  textAlign: item.dir === 'right' ? 'right' : 'left',
                  lineHeight: 1.1,
                }}
              >
                {item.text}
              </span>

              {/* Gold accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
                style={{
                  height: '1px',
                  width: '35%',
                  background:
                    item.dir === 'left'
                      ? 'linear-gradient(to right, rgba(184,150,90,0.45), transparent)'
                      : 'linear-gradient(to left, rgba(184,150,90,0.45), transparent)',
                  transformOrigin: item.dir === 'left' ? 'left' : 'right',
                  marginTop: '0.75rem',
                  marginLeft: item.dir === 'right' ? 'auto' : '0',
                }}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}

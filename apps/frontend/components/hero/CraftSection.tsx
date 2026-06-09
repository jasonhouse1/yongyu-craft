'use client'

import { motion } from 'framer-motion'

const STATS = [
  { number: '18K', unit: '純金', description: '純金鍛造' },
  { number: '三週', unit: '工時', description: '反覆調整' },
  { number: '一件', unit: '作品', description: '值得傳世' },
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
      {/* Block 1: craft stats */}
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto 6rem' }}>
        {STATS.map((item, i) => (
          <div key={i}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '2.5rem 0',
              }}
            >
              {/* Left: number + unit */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc)',
                    fontSize: 'clamp(4rem, 8vw, 9rem)',
                    fontWeight: 300,
                    color: '#E8ECF0',
                    lineHeight: 1,
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    color: '#C49A5A',
                    letterSpacing: '0.2em',
                    fontWeight: 300,
                  }}
                >
                  {item.unit}
                </span>
              </div>

              {/* Right: description */}
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#9A9590',
                  letterSpacing: '0.3em',
                  fontWeight: 300,
                }}
              >
                {item.description}
              </span>
            </motion.div>

            {/* Divider (skip after last item) */}
            {i < STATS.length - 1 && (
              <div style={{ height: '1px', backgroundColor: '#1A1815' }} />
            )}
          </div>
        ))}
      </div>

      {/* Block 2: brand declaration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          borderLeft: '2px solid #C49A5A',
          paddingLeft: '2rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
            color: '#7A7570',
            fontWeight: 300,
            lineHeight: 1.9,
            margin: 0,
          }}
        >
          不是裝飾，是工匠與金屬之間，最誠實的對話。
        </p>
      </motion.div>

      {/* Block 3: corner label */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          right: '3rem',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            color: '#C49A5A',
            letterSpacing: '0.5em',
            opacity: 0.5,
            fontWeight: 300,
          }}
        >
          CRAFTSMANSHIP · TAIWAN
        </span>
      </div>
    </section>
  )
}

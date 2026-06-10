'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

gsap.registerPlugin(ScrollTrigger)

const ROWS = [
  { value: '18K', unit: '純金', desc: '純金鍛造' },
  { value: '三週', unit: '', desc: '反覆調整' },
  { value: '一件', unit: '', desc: '值得傳世' },
]

export default function CraftSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const rows = containerRef.current?.querySelectorAll('.craft-row')
    if (!rows || rows.length === 0) return

    gsap.fromTo(
      rows,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: '#080706',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 5vw',
        position: 'relative',
      }}
    >
      {/* Rows */}
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        {ROWS.map((row, i) => (
          <div key={i}>
            <div
              className="craft-row"
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '2.5rem 0',
              }}
            >
              {/* Left: large value + unit */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc)',
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.88)',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  {row.value}
                </span>
                {row.unit && (
                  <span
                    style={{
                      fontFamily: 'var(--font-noto-serif-tc)',
                      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                      fontWeight: 300,
                      color: '#C49A5A',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {row.unit}
                  </span>
                )}
              </div>

              {/* Right: description */}
              <span
                style={{
                  fontFamily: 'var(--font-noto-serif-tc)',
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  fontWeight: 300,
                  color: '#9A9590',
                  letterSpacing: '0.2em',
                }}
              >
                {row.desc}
              </span>
            </div>

            {/* Divider — not after last row */}
            {i < ROWS.length - 1 && (
              <div style={{ height: '1px', backgroundColor: '#1A1815' }} />
            )}
          </div>
        ))}
      </div>

      {/* Brand statement */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '4rem auto 0',
          borderLeft: '2px solid #C49A5A',
          paddingLeft: '2rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.1rem)',
            fontWeight: 300,
            color: '#7A7570',
            letterSpacing: '0.08em',
            lineHeight: 2,
          }}
        >
          不是裝飾，是工匠與金屬之間，最誠實的對話。
        </p>
      </div>

      {/* Bottom-right label */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          right: '5vw',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            color: '#C49A5A',
            opacity: 0.5,
            textTransform: 'uppercase',
            fontWeight: 300,
          }}
        >
          CRAFTSMANSHIP · TAIWAN
        </span>
      </div>
    </section>
  )
}

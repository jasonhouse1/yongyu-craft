'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { text: '十八克拉', dir: 'left' as const },
  { text: '三週鍛造', dir: 'right' as const },
  { text: '一件傳世', dir: 'left' as const },
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
            className="craft-row"
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
                height: '100%',
                backgroundImage: 'url(/images/works/lumiere-ring/detail-2.png)',
                backgroundSize: 'cover',
                backgroundPosition: `center ${i * 33}%`,
              }}
            />

            {/* Main text */}
            <div style={{ position: 'relative', zIndex: 1 }}>
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
              <div
                style={{
                  height: '1px',
                  width: '35%',
                  background:
                    item.dir === 'left'
                      ? 'linear-gradient(to right, rgba(184,150,90,0.45), transparent)'
                      : 'linear-gradient(to left, rgba(184,150,90,0.45), transparent)',
                  marginTop: '0.75rem',
                  marginLeft: item.dir === 'right' ? 'auto' : '0',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

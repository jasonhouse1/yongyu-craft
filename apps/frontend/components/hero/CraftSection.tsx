'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { text: '十八克拉', dir: 'left' as const },
  { text: '三週鍛造', dir: 'center' as const },
  { text: '一件傳世', dir: 'right' as const },
]

type Dir = 'left' | 'center' | 'right'

export default function CraftSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const rows = containerRef.current?.querySelectorAll('.craft-row')
    if (!rows || rows.length === 0) return

    gsap.fromTo(
      rows,
      { y: -40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, { scope: containerRef })

  function textAlign(dir: Dir): 'left' | 'center' | 'right' {
    if (dir === 'right') return 'right'
    if (dir === 'center') return 'center'
    return 'left'
  }

  function accentLine(dir: Dir) {
    if (dir === 'center') {
      return {
        background: 'linear-gradient(to right, transparent, rgba(184,150,90,0.45), transparent)',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
      }
    }
    if (dir === 'right') {
      return {
        background: 'linear-gradient(to left, rgba(184,150,90,0.45), transparent)',
        marginLeft: 'auto',
        width: '40%',
      }
    }
    return {
      background: 'linear-gradient(to right, rgba(184,150,90,0.45), transparent)',
      marginLeft: '0',
      width: '40%',
    }
  }

  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: '#080706',
        padding: '6vh 5vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Brushed texture base */}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="craft-row"
            style={{
              position: 'relative',
              padding: '3rem 2rem',
              overflow: 'hidden',
              borderRight: i < 2 ? '1px solid rgba(196,154,90,0.08)' : 'none',
            }}
          >
            {/* Per-column texture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.07,
                pointerEvents: 'none',
                backgroundImage: 'url(/images/works/lumiere-ring/detail-2.png)',
                backgroundSize: 'cover',
                backgroundPosition: `center ${i * 33}%`,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-noto-serif-tc)',
                  fontSize: 'clamp(2.5rem, 4.5vw, 6rem)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.88)',
                  letterSpacing: '0.06em',
                  display: 'block',
                  textAlign: textAlign(item.dir),
                  lineHeight: 1.1,
                }}
              >
                {item.text}
              </span>

              <div
                style={{
                  height: '1px',
                  marginTop: '0.75rem',
                  ...accentLine(item.dir),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

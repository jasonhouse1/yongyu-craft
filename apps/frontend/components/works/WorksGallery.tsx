'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Link from 'next/link'
import type { WorkSnapshot } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  works: WorkSnapshot[]
}

function WorkCard({ work, i }: { work: WorkSnapshot; i: number }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isEven = i % 2 === 0

  useGSAP(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, { scope: cardRef })

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: isEven ? '60% 40%' : '40% 60%',
        height: '80vh',
        marginBottom: '20vh',
        cursor: 'pointer',
      }}
    >
      {/* Image block */}
      <div
        style={{
          order: isEven ? 0 : 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(196,154,90,0.04)',
          border: '1px solid rgba(196,154,90,0.08)',
        }}
      >
        {work.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.coverImage}
            alt={work.titleZh}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              background: 'linear-gradient(135deg, #111010 0%, #1A1815 50%, #111010 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 40px,
                  rgba(196,154,90,0.02) 40px,
                  rgba(196,154,90,0.02) 41px
                )`,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-noto-serif-tc)',
                fontSize: '8rem',
                color: '#C49A5A',
                opacity: 0.15,
                lineHeight: 1,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {work.titleZh[0]}
            </span>
          </div>
        )}
      </div>

      {/* Text block */}
      <Link
        href={`/works/${work.categoryId}/${work.id}`}
        style={{
          order: isEven ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
        }}
      >
        <p
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.2em',
            color: 'rgba(196,154,90,0.55)',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          {work.categoryId}
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: 'clamp(1.75rem, 3vw, 3rem)',
            fontWeight: 300,
            color: '#E8ECF0',
            letterSpacing: hovered ? '0.09em' : '0.06em',
            lineHeight: 1.3,
            marginBottom: '1.5rem',
            transition: 'letter-spacing 0.4s ease',
          }}
        >
          {work.titleZh}
        </h2>

        {work.materials.length > 0 && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#A8A39D',
              letterSpacing: '0.1em',
              marginBottom: '2rem',
            }}
          >
            {work.materials.join(' · ')}
          </p>
        )}

        {work.priceType === 'fixed' && work.price != null && (
          <p style={{ fontSize: '1rem', color: '#C49A5A', letterSpacing: '0.05em' }}>
            NT$ {Number(work.price).toLocaleString()}
          </p>
        )}
        {work.priceType === 'range' && work.priceMin != null && work.priceMax != null && (
          <p style={{ fontSize: '1rem', color: '#C49A5A', letterSpacing: '0.05em' }}>
            NT$ {Number(work.priceMin).toLocaleString()} – {Number(work.priceMax).toLocaleString()}
          </p>
        )}
        {work.priceType === 'inquiry' && (
          <p style={{ fontSize: '0.875rem', color: '#A8A39D', letterSpacing: '0.08em' }}>
            洽詢價格
          </p>
        )}

        <div
          style={{
            marginTop: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'rgba(196,154,90,0.7)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <span>查看詳情</span>
          <span>→</span>
        </div>
      </Link>
    </div>
  )
}

export default function WorksGallery({ works }: Props) {
  if (works.length === 0) {
    return (
      <p style={{ fontSize: '0.875rem', color: '#A8A39D', padding: '6rem 3rem' }}>
        目前尚無作品
      </p>
    )
  }

  return (
    <div>
      {works.map((work, i) => (
        <WorkCard key={work.id} work={work} i={i} />
      ))}
    </div>
  )
}

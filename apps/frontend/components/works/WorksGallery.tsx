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

  useGSAP(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: (i % 2) * 0.15,
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
    <div ref={cardRef}>
      <Link href={`/works/${work.categoryId}/${work.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          className="works-card-thumb"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
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
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.6s ease',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #111010 0%, #1A1815 50%, #111010 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-noto-serif-tc)',
                  fontSize: '6rem',
                  color: '#C49A5A',
                  opacity: 0.12,
                  lineHeight: 1,
                }}
              >
                {work.titleZh[0]}
              </span>
            </div>
          )}
          <div className="works-card-overlay">
            <span style={{ color: '#C49A5A', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
              查看詳情
            </span>
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              color: 'rgba(196,154,90,0.55)',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            {work.categoryId}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-noto-serif-tc)',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
              fontWeight: 300,
              color: '#E8ECF0',
              letterSpacing: '0.06em',
              lineHeight: 1.3,
              marginBottom: '0.4rem',
            }}
          >
            {work.titleZh}
          </h2>
          {work.materials.length > 0 && (
            <p style={{ fontSize: '0.95rem', color: '#A8A39D', letterSpacing: '0.08em' }}>
              {work.materials.join(' · ')}
            </p>
          )}
          {work.priceType === 'fixed' && work.price != null && (
            <p style={{ fontSize: '0.9rem', color: '#C49A5A', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              NT$ {Number(work.price).toLocaleString()}
            </p>
          )}
          {work.priceType === 'range' && work.priceMin != null && work.priceMax != null && (
            <p style={{ fontSize: '0.9rem', color: '#C49A5A', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              NT$ {Number(work.priceMin).toLocaleString()} – {Number(work.priceMax).toLocaleString()}
            </p>
          )}
          {work.priceType === 'inquiry' && (
            <p style={{ fontSize: '0.875rem', color: '#A8A39D', letterSpacing: '0.08em', marginTop: '0.5rem' }}>
              洽詢價格
            </p>
          )}
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
    <div
      className="works-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '4rem 3rem',
        padding: '4rem 3rem',
      }}
    >
      {works.map((work, i) => (
        <WorkCard key={work.id} work={work} i={i} />
      ))}
    </div>
  )
}

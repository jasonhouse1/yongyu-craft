'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { WorkSnapshot } from '@/lib/api'

interface Props {
  works: WorkSnapshot[]
}

export default function WorksGallery({ works }: Props) {
  if (works.length === 0) {
    return (
      <p style={{ fontSize: '0.875rem', color: '#6B6560', padding: '6rem 3rem' }}>
        目前尚無作品
      </p>
    )
  }

  return (
    <div>
      {works.map((work, i) => {
        const isEven = i % 2 === 0
        return (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: isEven ? '60% 40%' : '40% 60%',
              height: '80vh',
              marginBottom: '20vh',
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
                    transition: 'transform 0.8s ease',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(135deg, rgba(196,154,90,0.08), rgba(8,7,6,0.9))',
                  }}
                />
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
                  letterSpacing: '0.06em',
                  lineHeight: 1.3,
                  marginBottom: '1.5rem',
                }}
              >
                {work.titleZh}
              </h2>

              {work.materials.length > 0 && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#6B6560',
                    letterSpacing: '0.1em',
                    marginBottom: '2rem',
                  }}
                >
                  {work.materials.join(' · ')}
                </p>
              )}

              {work.priceType === 'fixed' && work.price != null && (
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#C49A5A',
                    letterSpacing: '0.05em',
                  }}
                >
                  NT$ {Number(work.price).toLocaleString()}
                </p>
              )}
              {work.priceType === 'range' &&
                work.priceMin != null &&
                work.priceMax != null && (
                  <p
                    style={{
                      fontSize: '1rem',
                      color: '#C49A5A',
                      letterSpacing: '0.05em',
                    }}
                  >
                    NT$ {Number(work.priceMin).toLocaleString()} –{' '}
                    {Number(work.priceMax).toLocaleString()}
                  </p>
                )}
              {work.priceType === 'inquiry' && (
                <p style={{ fontSize: '0.875rem', color: '#6B6560', letterSpacing: '0.08em' }}>
                  洽詢價格
                </p>
              )}

              {/* Arrow */}
              <div
                style={{
                  marginTop: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(196,154,90,0.5)',
                }}
              >
                <span>查看詳情</span>
                <span>→</span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

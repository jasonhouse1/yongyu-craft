'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useMember } from '@/lib/member-context'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

interface Work {
  id: string
  slug: string
  titleZh: string
  categoryId: string
  coverImage: string
  priceType: string
}

export default function MemberFavoritesPage() {
  const { token } = useMember()
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/api/member/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setWorks(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  async function removeFavorite(workId: string) {
    await fetch(`${API_URL}/api/member/favorites/${workId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token ?? ''}` },
    })
    setWorks(ws => ws.filter(w => w.id !== workId))
  }

  return (
    <main style={{ padding: '3rem' }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'rgba(196,154,90,0.6)', marginBottom: '1rem' }}>
        FAVOURITES
      </p>
      <h1 style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, color: '#E8ECF0', letterSpacing: '0.06em', marginBottom: '3rem' }}>
        收藏作品
      </h1>
      {loading && <p style={{ color: '#6B6560', fontSize: '0.85rem' }}>載入中...</p>}
      {!loading && works.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#6B6560', fontSize: '0.875rem', marginBottom: '1.5rem' }}>尚未收藏任何作品</p>
          <Link href="/works" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(196,154,90,0.6)' }}>
            瀏覽作品 →
          </Link>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
        {works.map(work => (
          <div key={work.id} style={{ position: 'relative' }}>
            <Link href={`/works/${work.categoryId}/${work.id}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{
                aspectRatio: '3/4', backgroundColor: 'rgba(196,154,90,0.06)',
                border: '1px solid rgba(196,154,90,0.1)', overflow: 'hidden', marginBottom: '1rem',
              }}>
                {work.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.coverImage} alt={work.titleZh}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: '1rem', color: '#E8ECF0', fontWeight: 300, marginBottom: '0.25rem' }}>
                {work.titleZh}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#6B6560', letterSpacing: '0.08em' }}>
                {work.categoryId}
              </p>
            </Link>
            <button
              onClick={() => removeFavorite(work.id)}
              style={{
                position: 'absolute', top: '0.75rem', right: '0.75rem',
                background: 'rgba(8,7,6,0.7)', border: 'none', color: '#C49A5A',
                fontSize: '1.1rem', cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
              }}
              title="取消收藏"
            >
              ♥
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

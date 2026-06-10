'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMember } from '@/lib/member-context'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

interface Stats {
  favoritesCount: number
  inquiriesCount: number
}

export default function MemberDashboardPage() {
  const { member, token } = useMember()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified') === 'true'
  const [stats, setStats] = useState<Stats>({ favoritesCount: 0, inquiriesCount: 0 })

  useEffect(() => {
    if (!token) return
    const headers = { Authorization: `Bearer ${token}` }
    Promise.all([
      fetch(`${API_URL}/api/member/favorites`, { headers }).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${API_URL}/api/member/inquiries`, { headers }).then(r => r.json()).catch(() => ({ items: [] })),
    ]).then(([favs, inqs]) => {
      setStats({
        favoritesCount: favs.items?.length ?? 0,
        inquiriesCount: inqs.items?.length ?? 0,
      })
    })
  }, [token])

  const cards = [
    { href: '/member/favorites', label: '收藏作品', value: stats.favoritesCount, unit: '件' },
    { href: '/member/inquiries', label: '詢價記錄', value: stats.inquiriesCount, unit: '則' },
    { href: '/member/settings', label: '帳號設定', value: null, unit: '' },
  ]

  return (
    <main style={{ padding: '3rem' }}>
      {verified && (
        <div style={{
          marginBottom: '2rem', padding: '1rem 1.5rem',
          border: '1px solid rgba(196,154,90,0.3)',
          background: 'rgba(196,154,90,0.05)',
          fontSize: '0.85rem', color: '#C49A5A', letterSpacing: '0.06em',
        }}>
          信箱驗證成功，歡迎加入永裕工藝。
        </div>
      )}
      <p style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, color: '#E8ECF0', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
        {member?.name ? `歡迎，${member.name}` : '會員中心'}
      </p>
      <p style={{ fontSize: '0.75rem', color: '#6B6560', letterSpacing: '0.08em', marginBottom: '3rem' }}>
        {member?.email}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{
            display: 'block', padding: '2rem',
            border: '1px solid rgba(196,154,90,0.1)',
            background: 'rgba(196,154,90,0.03)',
            textDecoration: 'none', transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196,154,90,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196,154,90,0.1)'}
          >
            {card.value !== null && (
              <p style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: '2.5rem', fontWeight: 300, color: '#C49A5A', marginBottom: '0.5rem', lineHeight: 1 }}>
                {card.value}<span style={{ fontSize: '1rem', marginLeft: '0.25rem', color: 'rgba(196,154,90,0.6)' }}>{card.unit}</span>
              </p>
            )}
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#9A9590' }}>
              {card.label}
            </p>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(196,154,90,0.08)' }}>
        <Link href="/works" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(196,154,90,0.5)' }}>
          瀏覽作品 →
        </Link>
      </div>
    </main>
  )
}

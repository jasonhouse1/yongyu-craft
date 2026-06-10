'use client'

import { useEffect, useState } from 'react'
import { useMember } from '@/lib/member-context'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

interface Inquiry {
  id: string
  inquiryType: string
  status: string
  message: string
  createdAt: string
}

const STATUS_LABEL: Record<string, string> = {
  new: '新詢價', pending: '處理中', replied: '已回覆',
  contacted: '已聯繫', negotiating: '洽談中', completed: '已完成', closed: '已關閉',
}

const TYPE_LABEL: Record<string, string> = {
  artwork: '作品詢價', custom: '客製化', appointment: '預約',
  corporate: '企業合作', international: '海外詢問',
}

export default function MemberInquiriesPage() {
  const { token } = useMember()
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/api/member/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  return (
    <main style={{ padding: '3rem' }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'rgba(196,154,90,0.6)', marginBottom: '1rem' }}>
        INQUIRIES
      </p>
      <h1 style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, color: '#E8ECF0', letterSpacing: '0.06em', marginBottom: '3rem' }}>
        詢價記錄
      </h1>
      {loading && <p style={{ color: '#6B6560', fontSize: '0.85rem' }}>載入中...</p>}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#6B6560', fontSize: '0.875rem', marginBottom: '1.5rem' }}>尚無詢價記錄</p>
          <Link href="/inquiry" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(196,154,90,0.6)' }}>
            開始詢價 →
          </Link>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{
            padding: '1.5rem 2rem',
            border: '1px solid rgba(196,154,90,0.08)',
            background: 'rgba(196,154,90,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: '#C49A5A', background: 'rgba(196,154,90,0.1)', padding: '2px 8px' }}>
                  {TYPE_LABEL[item.inquiryType] ?? item.inquiryType}
                </span>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: '#9A9590' }}>
                  {STATUS_LABEL[item.status] ?? item.status}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#6B6560' }}>
                {new Date(item.createdAt).toLocaleDateString('zh-TW')}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(232,236,240,0.6)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {item.message.length > 120 ? item.message.slice(0, 120) + '...' : item.message}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

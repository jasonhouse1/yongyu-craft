'use client'

import { useEffect, useState } from 'react'
import { useMember } from '@/lib/member-context'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

interface Props {
  workId: string
  categoryId: string
}

export default function FavoriteButton({ workId, categoryId }: Props) {
  const { token, isLoggedIn } = useMember()
  const router = useRouter()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/api/member/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const ids: string[] = data.items?.map((w: { id: string }) => w.id) ?? []
        setFavorited(ids.includes(workId))
      })
      .catch(() => {})
  }, [token, workId])

  async function toggle() {
    if (!isLoggedIn) {
      router.push(`/member/login?redirect=/works/${categoryId}/${workId}`)
      return
    }
    setLoading(true)
    try {
      const method = favorited ? 'DELETE' : 'POST'
      await fetch(`${API_URL}/api/member/favorites/${workId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })
      setFavorited(f => !f)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? '取消收藏' : '加入收藏'}
      style={{
        background: 'none',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '1.4rem',
        color: favorited ? '#C49A5A' : 'rgba(232,236,240,0.35)',
        transition: 'color 0.2s ease',
        padding: '4px 8px',
        lineHeight: 1,
        opacity: loading ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.color = '#C49A5A' }}
      onMouseLeave={e => { if (!loading && !favorited) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,236,240,0.35)' }}
    >
      {favorited ? '♥' : '♡'}
    </button>
  )
}

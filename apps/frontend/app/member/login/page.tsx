'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMember } from '@/lib/member-context'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function MemberLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useMember()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? '登入失敗')
        return
      }
      login(data.token, data.member)
      const redirect = searchParams.get('redirect')
      router.push(redirect ?? '/member')
    } catch {
      setError('連線失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const field: React.CSSProperties = {
    width: '100%', background: 'none', border: 'none',
    borderBottom: '1px solid rgba(196,154,90,0.2)',
    color: '#E8ECF0', fontSize: '1rem', padding: '0.75rem 0',
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: '#080706',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Link href="/" style={{
          display: 'block', textAlign: 'center', marginBottom: '3rem',
          fontFamily: 'var(--font-noto-serif-tc)', fontSize: '1.25rem',
          letterSpacing: '0.12em', color: '#C49A5A',
        }}>
          永裕工藝
        </Link>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'rgba(196,154,90,0.6)', textAlign: 'center', marginBottom: '2.5rem' }}>
          MEMBER LOGIN
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>EMAIL</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" style={field}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>密碼</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="current-password" style={field}
            />
          </div>
          {error && (
            <p style={{ fontSize: '0.8rem', color: '#f87171', textAlign: 'center' }}>{error}</p>
          )}
          <button
            type="submit" disabled={loading}
            className="btn-cta-outline"
            style={{ marginTop: '0.5rem', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/member/register" style={{ fontSize: '0.75rem', color: 'rgba(196,154,90,0.6)', letterSpacing: '0.08em' }}>
            還沒有帳號？
          </Link>
          <Link href="/member/forgot-password" style={{ fontSize: '0.75rem', color: 'rgba(232,236,240,0.3)', letterSpacing: '0.08em' }}>
            忘記密碼
          </Link>
        </div>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('密碼至少 8 字元'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/member/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? '重設失敗'); return }
      setDone(true)
    } catch {
      setError('連線失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main style={{
        minHeight: '100vh', backgroundColor: '#080706',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: '#f87171', fontSize: '0.875rem' }}>無效的重設連結</p>
      </main>
    )
  }

  if (done) {
    return (
      <main style={{
        minHeight: '100vh', backgroundColor: '#080706',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: '#C49A5A', marginBottom: '1.5rem' }}>DONE</p>
          <p style={{ color: 'rgba(232,236,240,0.7)', lineHeight: 1.8, fontSize: '0.9rem' }}>
            密碼已重設，請使用新密碼登入。
          </p>
          <Link href="/member/login" style={{
            display: 'inline-block', marginTop: '2rem',
            fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(196,154,90,0.7)',
          }}>
            前往登入
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: '#080706',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
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
          RESET PASSWORD
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>新密碼（至少 8 字元）</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="new-password"
              style={{
                width: '100%', background: 'none', border: 'none',
                borderBottom: '1px solid rgba(196,154,90,0.2)',
                color: '#E8ECF0', fontSize: '1rem', padding: '0.75rem 0',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          {error && <p style={{ fontSize: '0.8rem', color: '#f87171', textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-cta-outline"
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '重設中...' : '重設密碼'}
          </button>
        </form>
      </div>
    </main>
  )
}

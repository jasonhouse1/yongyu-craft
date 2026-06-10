'use client'

import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/member/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setDone(true)
    } catch {
      setError('連線失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <main style={{
        minHeight: '100vh', backgroundColor: '#080706',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: '#C49A5A', marginBottom: '1.5rem' }}>EMAIL SENT</p>
          <p style={{ color: 'rgba(232,236,240,0.7)', lineHeight: 1.8, fontSize: '0.9rem' }}>
            如果此 Email 已註冊，重設連結已寄出，請查看信箱。
          </p>
          <Link href="/member/login" style={{
            display: 'inline-block', marginTop: '2rem',
            fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(196,154,90,0.7)',
          }}>
            返回登入
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
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'rgba(196,154,90,0.6)', textAlign: 'center', marginBottom: '2rem' }}>
          FORGOT PASSWORD
        </p>
        <p style={{ fontSize: '0.8rem', color: '#9A9590', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}>
          輸入您的 Email，我們將寄出重設連結。
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>EMAIL</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required style={{
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
            {loading ? '送出中...' : '送出'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/member/login" style={{ fontSize: '0.75rem', color: 'rgba(232,236,240,0.3)', letterSpacing: '0.08em' }}>
            返回登入
          </Link>
        </div>
      </div>
    </main>
  )
}

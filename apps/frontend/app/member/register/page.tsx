'use client'

import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function MemberRegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('密碼至少 8 個字元'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/member/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined, password, honeypot }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? '註冊失敗')
        return
      }
      setSuccess(true)
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

  if (success) {
    return (
      <main style={{
        minHeight: '100vh', backgroundColor: '#080706',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: '#C49A5A', marginBottom: '1.5rem' }}>
            VERIFICATION SENT
          </p>
          <p style={{ color: 'rgba(232,236,240,0.7)', lineHeight: 1.8, fontSize: '0.9rem' }}>
            驗證信已寄出，請至信箱點擊連結完成驗證後登入。
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
          MEMBER REGISTER
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={field} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>姓名（選填）</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" style={field} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>密碼（至少 8 字元）</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" style={field} />
          </div>
          {/* Honeypot */}
          <input
            type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)}
            tabIndex={-1} aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          />
          {error && <p style={{ fontSize: '0.8rem', color: '#f87171', textAlign: 'center' }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            className="btn-cta-outline"
            style={{ marginTop: '0.5rem', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '送出中...' : '建立帳號'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/member/login" style={{ fontSize: '0.75rem', color: 'rgba(196,154,90,0.6)', letterSpacing: '0.08em' }}>
            已有帳號？前往登入
          </Link>
        </div>
      </div>
    </main>
  )
}

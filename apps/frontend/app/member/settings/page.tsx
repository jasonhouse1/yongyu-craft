'use client'

import { useEffect, useState } from 'react'
import { useMember } from '@/lib/member-context'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function MemberSettingsPage() {
  const { member, token, login } = useMember()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [curPwd, setCurPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdSaving, setPwdSaving] = useState(false)

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/api/member/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setName(data.name ?? '')
        setPhone(data.phone ?? '')
      })
      .catch(() => {})
  }, [token])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/api/member/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name || undefined, phone: phone || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.message ?? '儲存失敗'); return }
      if (token && member) login(token, { ...member, name: data.name })
      setMsg('已更新')
    } catch {
      setMsg('連線失敗')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPwd.length < 8) { setPwdMsg('新密碼至少 8 字元'); return }
    setPwdMsg('')
    setPwdSaving(true)
    try {
      const res = await fetch(`${API_URL}/api/member/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }),
      })
      const data = await res.json()
      if (!res.ok) { setPwdMsg(data.message ?? '更新失敗'); return }
      setPwdMsg('密碼已更新')
      setCurPwd('')
      setNewPwd('')
    } catch {
      setPwdMsg('連線失敗')
    } finally {
      setPwdSaving(false)
    }
  }

  const field: React.CSSProperties = {
    width: '100%', background: 'none', border: 'none',
    borderBottom: '1px solid rgba(196,154,90,0.2)',
    color: '#E8ECF0', fontSize: '1rem', padding: '0.75rem 0',
    outline: 'none', fontFamily: 'inherit',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '0.65rem', letterSpacing: '0.4em', color: 'rgba(196,154,90,0.6)',
    marginBottom: '1.5rem',
  }

  return (
    <main style={{ padding: '3rem', maxWidth: '500px' }}>
      <h1 style={{ fontFamily: 'var(--font-noto-serif-tc)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, color: '#E8ECF0', letterSpacing: '0.06em', marginBottom: '3rem' }}>
        帳號設定
      </h1>

      {/* Profile */}
      <section style={{ marginBottom: '3rem' }}>
        <p style={sectionTitle}>PROFILE</p>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>EMAIL（不可更改）</label>
            <p style={{ fontSize: '0.875rem', color: '#6B6560', padding: '0.75rem 0' }}>{member?.email}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>姓名</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={field} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>電話</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={field} />
          </div>
          {msg && <p style={{ fontSize: '0.8rem', color: msg === '已更新' ? '#C49A5A' : '#f87171' }}>{msg}</p>}
          <button type="submit" disabled={saving} className="btn-cta-outline"
            style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '儲存中...' : '儲存'}
          </button>
        </form>
      </section>

      {/* Change password */}
      <section style={{ paddingTop: '2rem', borderTop: '1px solid rgba(196,154,90,0.08)' }}>
        <p style={sectionTitle}>CHANGE PASSWORD</p>
        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>目前密碼</label>
            <input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} required style={field} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#9A9590', display: 'block', marginBottom: '0.5rem' }}>新密碼（至少 8 字元）</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required style={field} />
          </div>
          {pwdMsg && <p style={{ fontSize: '0.8rem', color: pwdMsg === '密碼已更新' ? '#C49A5A' : '#f87171' }}>{pwdMsg}</p>}
          <button type="submit" disabled={pwdSaving} className="btn-cta-outline"
            style={{ opacity: pwdSaving ? 0.6 : 1, cursor: pwdSaving ? 'not-allowed' : 'pointer' }}>
            {pwdSaving ? '更新中...' : '更新密碼'}
          </button>
        </form>
      </section>
    </main>
  )
}

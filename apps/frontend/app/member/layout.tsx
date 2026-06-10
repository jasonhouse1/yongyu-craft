'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useMember } from '@/lib/member-context'

const PUBLIC_PATHS = [
  '/member/login',
  '/member/register',
  '/member/forgot-password',
  '/member/reset-password',
]

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, member, logout } = useMember()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
    if (!isLoggedIn && !isPublic) {
      router.push('/member/login')
    }
  }, [mounted, isLoggedIn, pathname, router])

  const isPublicPage = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  if (!mounted) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#080706' }} />
  }

  if (isPublicPage) {
    return <>{children}</>
  }

  if (!isLoggedIn) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#080706' }} />
  }

  const navLinks = [
    { href: '/member', label: '總覽' },
    { href: '/member/favorites', label: '收藏' },
    { href: '/member/inquiries', label: '詢價記錄' },
    { href: '/member/settings', label: '設定' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080706' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1.25rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'rgba(8,7,6,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(196,154,90,0.08)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-noto-serif-tc)',
          fontSize: '1rem', letterSpacing: '0.12em', color: '#C49A5A',
        }}>
          YY
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: '0.75rem', letterSpacing: '0.12em',
              color: pathname === l.href ? '#C49A5A' : 'rgba(232,236,240,0.4)',
              fontWeight: 300,
            }}>
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { logout(); router.push('/') }}
            style={{
              background: 'none', border: 'none',
              fontSize: '0.75rem', letterSpacing: '0.12em',
              color: 'rgba(232,236,240,0.25)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            登出
          </button>
        </div>
      </nav>
      <div style={{ paddingTop: '4.5rem', minHeight: '100vh', color: '#E8ECF0' }}>
        {member && (
          <div style={{ padding: '2rem 3rem 0', fontSize: '0.75rem', color: 'rgba(196,154,90,0.55)', letterSpacing: '0.1em' }}>
            {member.name ?? member.email}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

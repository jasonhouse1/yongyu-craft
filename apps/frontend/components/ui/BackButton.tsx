'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ label = '返回' }: { label?: string }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'none',
        border: 'none',
        color: 'rgba(232,236,240,0.35)',
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'inherit',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#C49A5A' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,236,240,0.35)' }}
    >
      ← {label}
    </button>
  )
}

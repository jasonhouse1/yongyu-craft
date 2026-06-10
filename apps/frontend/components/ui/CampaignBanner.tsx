'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
const DISMISS_KEY = 'yyc_campaign_dismissed'

interface Campaign {
  id: string
  title: string
  subtitle: string | null
  ctaText: string | null
  ctaUrl: string | null
  bgColor: string
  accentColor: string
}

export default function CampaignBanner() {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY)) return

    fetch(`${API_URL}/api/campaigns/active`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.campaign) {
          setCampaign(data.campaign)
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
        }
      })
      .catch(() => {})
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(DISMISS_KEY, campaign?.id ?? '1')
    setTimeout(() => setCampaign(null), 350)
  }

  if (!campaign) return null

  return (
    <div
      className="campaign-banner"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: campaign.bgColor,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Top border line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', backgroundColor: campaign.accentColor, opacity: 0.3 }} />
      {/* Bottom border line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', backgroundColor: campaign.accentColor, opacity: 0.3 }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0 3.5rem 0 1rem',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            color: '#F0EBE0',
            letterSpacing: '0.1em',
            fontWeight: 300,
            whiteSpace: 'nowrap',
          }}
        >
          {campaign.title}
        </span>

        {campaign.subtitle && (
          <>
            <span style={{ color: campaign.accentColor, opacity: 0.5, userSelect: 'none' }}>·</span>
            <span
              style={{
                fontSize: '0.8rem',
                color: campaign.accentColor,
                letterSpacing: '0.08em',
                fontWeight: 300,
                whiteSpace: 'nowrap',
              }}
            >
              {campaign.subtitle}
            </span>
          </>
        )}

        {campaign.ctaText && campaign.ctaUrl && (
          <>
            <span style={{ color: campaign.accentColor, opacity: 0.5, userSelect: 'none' }}>·</span>
            <Link
              href={campaign.ctaUrl}
              className="campaign-cta"
              style={{
                fontSize: '0.75rem',
                color: campaign.accentColor,
                letterSpacing: '0.12em',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = campaign.accentColor }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent' }}
            >
              {campaign.ctaText}
            </Link>
          </>
        )}
      </div>

      <button
        onClick={dismiss}
        aria-label="關閉活動通知"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: campaign.accentColor,
          fontSize: '1.1rem',
          lineHeight: 1,
          cursor: 'pointer',
          padding: '4px 6px',
          opacity: 0.45,
          transition: 'opacity 0.2s ease',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.45' }}
      >
        ×
      </button>
    </div>
  )
}

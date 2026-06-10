import Link from 'next/link'

const NAV_LINKS = [
  { href: '/works', label: '作品' },
  { href: '/about', label: '關於' },
  { href: '/contact', label: '聯絡' },
  { href: '/inquiry', label: '詢價' },
]

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#080706',
      borderTop: '1px solid #1A1815',
      padding: '3rem 5vw',
    }}>
      <div className="footer-grid">
        {/* Left */}
        <div>
          <p style={{
            fontFamily: 'var(--font-noto-serif-tc)',
            fontSize: '1.1rem',
            letterSpacing: '0.12em',
            color: '#C49A5A',
            marginBottom: '0.4rem',
            fontWeight: 300,
          }}>
            永裕工藝
          </p>
          <p style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            color: '#6B6560',
            fontWeight: 300,
          }}>
            YONGYU CRAFT
          </p>
        </div>

        {/* Center */}
        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-nav-link"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'rgba(232,236,240,0.35)',
                fontWeight: 300,
                transition: 'color 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <p style={{
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
          color: 'rgba(232,236,240,0.18)',
          textAlign: 'right',
          fontWeight: 300,
        }}>
          © 2026 永裕工藝. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

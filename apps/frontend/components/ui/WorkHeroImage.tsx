'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt: string
}

export default function WorkHeroImage({ src, alt }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #111010 25%, #1A1815 50%, #111010 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            zIndex: 0,
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
    </>
  )
}

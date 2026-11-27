'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  poster?: string
  alt?: string
}

/**
 * Full-bleed looping hero background video, mirroring WorkHeroImage's cover
 * treatment. Muted + autoplay + loop so it plays as an ambient background.
 * Respects prefers-reduced-motion: when the viewer asks for less motion we
 * show the poster still instead of playing the loop.
 */
export default function WorkHeroVideo({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (reduced) v.pause()
    else v.play().catch(() => {})
  }, [reduced, loaded])

  // Reduced motion: a static poster, never the moving loop.
  if (reduced && poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
    )
  }

  return (
    <>
      {!loaded && (
        <div
          aria-hidden
          style={{ position: 'absolute', inset: 0, background: '#0D0D0B', zIndex: 0 }}
        />
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onLoadedData={() => setLoaded(true)}
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

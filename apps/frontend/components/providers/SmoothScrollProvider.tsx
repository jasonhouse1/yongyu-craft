'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  // 尊重使用者的「減少動態」偏好：開啟時停用平滑捲動劫持，回到原生捲動。
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (reduced) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, autoRaf: true }}>
      {children}
    </ReactLenis>
  )
}

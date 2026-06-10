'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface Member {
  id: string
  email: string
  name: string | null
}

interface MemberContextValue {
  member: Member | null
  token: string | null
  isLoggedIn: boolean
  login: (token: string, member: Member) => void
  logout: () => void
}

const MemberContext = createContext<MemberContextValue>({
  member: null,
  token: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
})

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('yyc_member_token')
    const savedMember = localStorage.getItem('yyc_member_data')
    if (savedToken && savedMember) {
      try {
        setToken(savedToken)
        setMember(JSON.parse(savedMember))
      } catch {}
    }
  }, [])

  function login(newToken: string, newMember: Member) {
    localStorage.setItem('yyc_member_token', newToken)
    localStorage.setItem('yyc_member_data', JSON.stringify(newMember))
    setToken(newToken)
    setMember(newMember)
  }

  function logout() {
    localStorage.removeItem('yyc_member_token')
    localStorage.removeItem('yyc_member_data')
    setToken(null)
    setMember(null)
  }

  return (
    <MemberContext.Provider value={{ member, token, isLoggedIn: !!token, login, logout }}>
      {children}
    </MemberContext.Provider>
  )
}

export function useMember() {
  return useContext(MemberContext)
}

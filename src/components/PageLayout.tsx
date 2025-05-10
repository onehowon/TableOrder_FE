// src/components/PageLayout.tsx
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  children: ReactNode
  isAdmin?: boolean
}

export default function PageLayout({ children, isAdmin = false }: Props) {
  const nav = useNavigate()
  const { pathname } = useLocation()

  // 홈으로 돌아갈 경로
  const adminHome    = '/admin'
  const customerHome = '/welcome'

  // 뒤로가기 버튼 표시 여부
  const showBack = pathname !== (isAdmin ? adminHome : customerHome)

  const goHome = () => {
    if (isAdmin)   nav(adminHome)
    else            nav(customerHome)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="flex items-center gap-2 p-4 bg-zinc-800">
        {showBack && (
          <button
            onClick={() => nav(-1)}
            className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
          >
            ← 뒤로
          </button>
        )}
        <button
          onClick={goHome}
          className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
        >
          {isAdmin ? '관리자 홈' : '고객 홈'}
        </button>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}

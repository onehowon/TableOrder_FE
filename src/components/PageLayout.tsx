import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

interface Props {
  children: ReactNode
  isAdmin?: boolean
}

export default function PageLayout({ children, isAdmin = false }: Props) {
  const nav = useNavigate()
  const { tableId } = useTable()
  const { pathname } = useLocation()

  // 돌아갈 기준 경로
  const adminHome   = '/admin'
  const customerHome = '/welcome'

  const showBack = pathname !== (isAdmin ? adminHome : customerHome)
  const showHome = true

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
        {showHome && (
          <button
            onClick={goHome}
            className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
          >
            {isAdmin ? '관리자 홈' : '고객 홈'}
          </button>
        )}
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}

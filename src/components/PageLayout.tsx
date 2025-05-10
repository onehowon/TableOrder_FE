import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SideNav from './SideNav'

interface Props {
  children: ReactNode
  isAdmin?: boolean
}

export default function PageLayout({ children, isAdmin = false }: Props) {
  const nav = useNavigate()
  const { pathname } = useLocation()

  // 고객 헤더 뒤로가기 여부
  const homePath = isAdmin ? '/admin' : '/welcome'
  const showBack = pathname !== homePath

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center px-6 bg-white border-b">
            <button
              onClick={() => nav(-1)}
              className="lg:hidden mr-4 text-gray-500"
            >
              ☰
            </button>
            {/* 페이지 타이틀은 각 컴포넌트에서 렌더 */}
          </header>
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>
    )
  }

  // 고객 레이아웃
  return (
    <div className="min-h-screen bg-zinc-900 text-white pb-28">
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
          onClick={() => nav(homePath)}
          className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
        >
          고객 홈
        </button>
      </header>
      <main className={`${showBack ? 'pt-14' : ''}`}>{children}</main>
    </div>
  )
}

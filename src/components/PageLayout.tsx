import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from './SideNav'

interface Props {
  children: ReactNode
  isAdmin?: boolean
}

export default function PageLayout({ children, isAdmin = false }: Props) {
  const nav = useNavigate()

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center px-6 bg-white border-b">
            <button
              onClick={()=>nav(-1)}
              className="lg:hidden mr-4 text-gray-500"
            >
              ☰
            </button>
          </header>
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>
    )
  }

  // 고객 영역 (사용하시는 페이지가 있다면 그대로 두세요)
  return <>{children}</>
}

// src/components/PageLayout.tsx
import type { ReactNode } from 'react'
import SideNav from './SideNav'

interface Props {
  children: ReactNode
  isAdmin?: boolean
}

export default function PageLayout({ children, isAdmin }: Props) {
  if (!isAdmin) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <SideNav />

      {/* 헤더 + 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-6 bg-white border-b shadow-sm">
          <h1 className="text-xl font-bold">admin page</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

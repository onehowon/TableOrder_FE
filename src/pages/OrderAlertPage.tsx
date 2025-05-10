import React, { useState} from 'react'
import type { ReactNode } from 'react'
import { HiMenu } from 'react-icons/hi'
import {
  FiBell,
  FiList,
  FiGrid,
  FiBarChart2,
  FiHome,
  FiCoffee,
  FiClipboard,
  FiClock,
} from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

interface PageLayoutProps {
  children?: ReactNode
  isAdmin?: boolean
}

export default function PageLayout({ children, isAdmin }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { pathname } = useLocation()

  const adminMenu = [
    { path: '/admin/alerts', label: '주문 알림', icon: <FiBell /> },
    { path: '/admin/orders', label: '주문 리스트', icon: <FiList /> },
    { path: '/admin/tables', label: '테이블 번호', icon: <FiGrid /> },
    { path: '/admin/sales',  label: '매출',     icon: <FiBarChart2 /> },
  ]

  const guestMenu = [
    { path: '/',              label: '홈',       icon: <FiHome /> },
    { path: '/menu',          label: '메뉴',     icon: <FiCoffee /> },
    { path: '/order/confirm', label: '주문 확인',icon: <FiClipboard /> },
    { path: '/orders/history',label: '주문 내역',icon: <FiClock /> },
  ]

  const menuItems = isAdmin ? adminMenu : guestMenu

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <aside className="bg-white w-[240px] h-full flex flex-col p-6 space-y-6 shadow-md">
          <button
            className="self-end text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <HiMenu size={24} />
          </button>
          <div className="text-2xl font-bold text-primary">
            {isAdmin ? 'Admin Page' : 'Customer'}
          </div>
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const active = pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition ${
                    active
                      ? 'bg-gray-200 text-primary'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {React.cloneElement(item.icon, { size: 20 })}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        <header className="flex items-center p-4 bg-white shadow-sm">
          {!sidebarOpen && (
            <button
              className="text-gray-500 hover:text-gray-700 mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <HiMenu size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold">
            {menuItems.find((m) => pathname.startsWith(m.path))?.label || '페이지'}
          </h1>
        </header>

        <main className="flex-1 bg-[#F5F7FF] p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
import { useState} from 'react'
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
    { path: '/admin/alerts', label: '주문 알림', icon: <FiBell size={20} /> },
    { path: '/admin/orders', label: '주문 리스트', icon: <FiList size={20} /> },
    { path: '/admin/tables', label: '테이블 번호', icon: <FiGrid size={20} /> },
    // '매출' 라우트가 '/admin/sales' 로 등록되지 않았으므로 제외하거나 라우트 추가 필요
    { path: '/admin/sales', label: '매출', icon: <FiBarChart2 size={20} /> },
  ]

  const guestMenu = [
    { path: '/', label: '홈', icon: <FiHome size={20} /> },
    { path: '/menu', label: '메뉴', icon: <FiCoffee size={20} /> },
    { path: '/order/confirm', label: '주문 확인', icon: <FiClipboard size={20} /> },
    { path: '/orders/history', label: '주문 내역', icon: <FiClock size={20} /> },
  ]

  const menuItems = isAdmin ? adminMenu : guestMenu
  const activeItem = menuItems.find(m => pathname.startsWith(m.path))

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
            {isAdmin ? 'admin page' : 'Customer'}
          </div>
          <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition ${
                  pathname.startsWith(item.path)
                    ? 'bg-gray-200 text-primary'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
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
            {activeItem?.label || ''}
          </h1>
        </header>

        <main className="flex-1 bg-[#F5F7FF] p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
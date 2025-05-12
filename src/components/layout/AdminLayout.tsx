// src/components/layout/AdminLayout.tsx
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import SideNav from '../SideNav'
import api from '@/api'   // default export = adminApi

export default function AdminLayout() {
  const nav = useNavigate()

  // 1) 로그인 토큰 확인
  const token = localStorage.getItem('accessToken')
  if (!token) {
    // 로그인되지 않은 상태면 /admin/login 으로 이동
    return <Navigate to="/admin/login" replace />
  }

  // 2) 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    delete api.defaults.headers.common['Authorization']
    nav('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
          <h1 className="text-xl font-bold">admin page</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
          >
            로그아웃
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

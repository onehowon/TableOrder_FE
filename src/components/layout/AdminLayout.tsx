import { Outlet, Navigate } from 'react-router-dom'
import SideNav from '../SideNav'

export default function AdminLayout() {
  // 1) 로그인 토큰 확인
  const token = localStorage.getItem('accessToken')
  if (!token) {
    // 로그인되지 않은 상태면 /admin/login 으로 이동
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-6 bg-white border-b shadow-sm">
          <h1 className="text-xl font-bold">admin page</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

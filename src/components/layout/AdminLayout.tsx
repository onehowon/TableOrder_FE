// src/components/layout/AdminLayout.tsx
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import SideNav from '../SideNav'
import api from '@/api'   // default export = adminApi
import { useEffect, useState, createContext } from 'react'
import { listRequestsAdmin } from '@/api'
import type { CustomerRequestDTO } from '@/api'

// 사운드 알림 전역 컴포넌트
import GlobalNotifier from '@/components/GlobalNotifier'

/** 읽지 않은 직원 호출 알림 개수를 공급하는 Context **/
export const UnreadRequestsContext = createContext<{ unread: number }>({ unread: 0 })

export default function AdminLayout() {
  const nav = useNavigate()

  // 1) 로그인 토큰 확인
  const token = localStorage.getItem('accessToken')
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  // 2) 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    delete api.defaults.headers.common['Authorization']
    nav('/admin/login', { replace: true })
  }

  // 3) 5초마다 직원 호출 리스트 폴링
  const [requests, setRequests] = useState<CustomerRequestDTO[]>([])
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await listRequestsAdmin()
        setRequests(res.data.data)
      } catch (e) {
        console.error('요청 알림 조회 실패', e)
      }
    }
    fetchRequests()
    const iv = setInterval(fetchRequests, 5000)
    return () => clearInterval(iv)
  }, [])

  const unread = requests.length

  return (
    <>
      {/* ─── Admin 전용 알림(주문 + 호출) 폴링/사운드 컴포넌트 ─── */}
      <GlobalNotifier />

      <UnreadRequestsContext.Provider value={{ unread }}>
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
      </UnreadRequestsContext.Provider>
    </>
  )
}

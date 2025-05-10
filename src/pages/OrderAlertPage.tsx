// src/pages/OrderAlertPage.tsx
import { useEffect, useState } from 'react'
import api from '../api'
import type { OrderAlertDTO } from '../types'

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<OrderAlertDTO[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<{ data: OrderAlertDTO[] }>('/admin/alerts')
        setAlerts(res.data.data)
      } catch (err) {
        console.error('OrderAlertPage 오류:', err)
      }
    }

    fetchAlerts()
    const iv = setInterval(fetchAlerts, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="bg-white w-[240px] h-full flex flex-col p-6 space-y-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <nav className="space-y-2">
          <div className="flex items-center space-x-3 py-2 px-4 rounded-lg bg-gray-100">
            {/* 아이콘 */}
            <span>📢</span>
            <span>주문 알림</span>
          </div>
          <div className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-gray-100 cursor-pointer">
            <span>📋</span>
            <span>주문 리스트</span>
          </div>
          {/* 추가 메뉴... */}
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-[#F5F7FF] p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">주문 알림</h1>
        <div className="space-y-6">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="relative bg-gray-100 p-4 rounded-[1.5rem] flex-1">
                <p className="text-gray-800">
                  <strong>{a.tableNumber}번 테이블</strong>에서{' '}
                  {a.items.map(x => `${x.menuName} ${x.quantity}개`).join(', ')} 주문하셨습니다.
                </p>
                <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-gray-500">현재 새로운 주문이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  )
}

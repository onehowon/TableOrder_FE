// src/pages/OrderAlertPage.tsx
import { useEffect, useState } from 'react'
import api from '../api'                    // ← axios 대신 api 인스턴스를 사용
import type { OrderAlertDTO } from '../types'

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<OrderAlertDTO[]>([])

  useEffect(() => {
    // 새 주문 알림을 5초마다 가져오는 함수
    const fetchAlerts = async () => {
      try {
        const res = await api.get<{ data: OrderAlertDTO[] }>('/admin/alerts')
        setAlerts(res.data.data)
      } catch (err) {
        console.error('OrderAlertPage fetch error:', err)
      }
    }

    fetchAlerts()
    const iv = setInterval(fetchAlerts, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-64 bg-white p-6 shadow-lg space-y-2">
        <button className="w-full bg-blue-500 text-white py-2 rounded mb-4">
          Table order
        </button>
        <ul className="space-y-3">
          {['주문', '추가', '삭제', '수정'].map((label) => (
            <li key={label}>
              <button className="w-full text-left px-4 py-3 bg-blue-50 rounded hover:bg-blue-100">
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 알림 리스트 */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">주문 알림</h1>
        <div className="space-y-6">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
              <div className="relative bg-gray-100 p-4 rounded-xl flex-1">
                <p className="text-gray-800">
                  <strong>{a.tableNumber}번 테이블</strong>에서{' '}
                  {a.items
                    .map((x) => `${x.menuName} ${x.quantity}개`)
                    .join(', ')} 주문하셨습니다.
                </p>
                <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleTimeString()}
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

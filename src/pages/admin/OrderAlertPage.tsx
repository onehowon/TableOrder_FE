// src/pages/admin/OrderAlertPage.tsx
import { useEffect, useState } from 'react'
import { getAlerts } from '@/api'
import type { OrderAlertDTO } from '@/api'

interface Notification {
  id: string
  message: string
  createdAt: string
}

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const res = await getAlerts() // CommonResp<OrderAlertDTO[]>
      const data = res.data.data

      const notis = data.map(o => ({
        id: `alert-${o.createdAt}-${o.tableNumber}`,
        // items 안에 있는 객체들이 { menuName, quantity } 혹은 { menuName, 0 }(요청)
        message:
          `${o.tableNumber}번 테이블에서 ` +
          o.items
            .map(i =>
              i.quantity > 0
                ? `${i.menuName} ${i.quantity}개 주문`
                : `${i.menuName} 요청`
            )
            .join(', '),
        createdAt: o.createdAt,
      }))

      // 최신순 정렬
      setAlerts(
        notis.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      )
    } catch (err) {
      console.error('알림 조회 실패', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
    const iv = setInterval(loadAlerts, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex h-full">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        {/* ... (생략) */}
      </aside>

      {/* 메인 */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">주문 알림</h1>
        {loading ? (
          <p>로딩 중…</p>
        ) : alerts.length === 0 ? (
          <p className="text-center text-gray-500">현재 알림이 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {alerts.map(alert => {
              const time = new Date(alert.createdAt).toLocaleTimeString(
                'ko-KR',
                { hour: '2-digit', minute: '2-digit' }
              )
              return (
                <div
                  key={alert.id}
                  className="flex items-start space-x-4"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                  <div className="flex-1 bg-white rounded-lg p-4 shadow">
                    <p className="text-gray-800">{alert.message}</p>
                    <span className="text-xs text-gray-500 block text-right mt-2">
                      {time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

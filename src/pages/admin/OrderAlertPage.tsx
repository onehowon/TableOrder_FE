import { useEffect, useState } from 'react'
import { getAlerts } from '@/api'
import type { OrderAlertDTO } from '@/api'

export default function OrderAlertsPage() {
  const [alerts, setAlerts]   = useState<OrderAlertDTO[]>([])
  const [loading, setLoading] = useState(true)

  const loadAlerts = async () => {
    try {
      const res = await getAlerts()
      setAlerts(res.data.data)
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
      {/* 사이드바 생략… */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">주문 알림</h1>
        {loading
          ? <p>로딩 중…</p>
          : (
            <div className="space-y-6">
              {alerts.map((alert, idx) => {
                const time = new Date(alert.createdAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit', minute: '2-digit'
                })
                const itemsText = alert.items
                  .map(i => `${i.name} ${i.quantity}개`)
                  .join(', ')
                return (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 bg-white rounded-lg p-4 shadow">
                      <p className="text-gray-800">
                        {alert.tableNumber}번 테이블에서 {itemsText}를 주문하였습니다.
                      </p>
                      <span className="text-xs text-gray-500 block text-right mt-2">
                        {time}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getAlerts, listRequestsAdmin } from '@/api'
import type { OrderAlertDTO, CustomerRequestDTO } from '@/api'

// 주문 및 요청 알림을 통합 처리하는 공통 인터페이스
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
      // 주문 알림과 직원 호출 알림을 동시에 조회
      const [orderRes, reqRes] = await Promise.all([
        getAlerts(),               // CommonResp<OrderAlertDTO[]>
        listRequestsAdmin(),       // CommonResp<CustomerRequestDTO[]>
      ])

      // 주문 알림 변환
      const orders = orderRes.data.data.map((o: OrderAlertDTO) => ({
        id: `order-${o.createdAt}-${o.tableNumber}`,
        message:
          `${o.tableNumber}번 테이블에서 ` +
          o.items.map(i => `${i.menuName} ${i.quantity}개`).join(', ') +
          '를 주문했습니다.',
        createdAt: o.createdAt,
      }))

      // 직원 호출 알림 변환
      const reqs = reqRes.data.data.map((r: CustomerRequestDTO) => ({
        id: `req-${r.id}`,
        message: `${r.tableNumber}번 테이블에서 직원을 호출했습니다.`,
        createdAt: r.createdAt,
      }))

      // 최신 순 정렬 후 상태 업데이트
      const combined = [...orders, ...reqs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setAlerts(combined)
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
        <button className="flex items-center space-x-2 w-full px-3 py-2 bg-blue-500 text-white rounded">
          <span>📋</span><span>Table order</span>
        </button>
        <div className="space-y-2 mt-6">
          {['주문', '추가', '삭제', '수정'].map(label => (
            <div
              key={label}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded"
            >
              <span>✉️</span><span>{label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">주문 알림</h1>
        {loading ? (
          <p>로딩 중…</p>
        ) : (
          <div className="space-y-6">
            {alerts.map(alert => {
              const time = new Date(alert.createdAt).toLocaleTimeString('ko-KR', {
                hour: '2-digit', minute: '2-digit'
              })
              return (
                <div key={alert.id} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 bg-white rounded-lg p-4 shadow">
                    <p className="text-gray-800">{alert.message}</p>
                    <span className="text-xs text-gray-500 block text-right mt-2">
                      {time}
                    </span>
                  </div>
                </div>
              )
            })}
            {alerts.length === 0 && (
              <p className="text-center text-gray-500">현재 알림이 없습니다.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
// src/pages/admin/OrderAlertPage.tsx
import { useEffect, useState } from 'react'
import { getAlerts } from '@/api'
import type { OrderAlertDTO } from '@/api'
import dayjs from 'dayjs'

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<OrderAlertDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getAlerts()
        // 방어 처리: res.data.data 가 배열이 아니면 빈 배열로
        const list = Array.isArray(res.data.data) ? res.data.data : []
        setAlerts(list)
      } catch (err: any) {
        console.error('알림 로드 에러', err)
        setError(err.message ?? '알 수 없는 오류')
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    load()
    const iv = window.setInterval(load, 5000)
    return () => clearInterval(iv)
  }, [])

  // 에러 상태 표시
  if (error) {
    return <p className="p-4 text-red-600">❌ 오류: {error}</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">주문 알림</h2>

      {loading && <p className="text-gray-500">로딩 중…</p>}

      {!loading && alerts.length === 0 && (
        <p className="text-gray-500">새 주문이 없습니다.</p>
      )}

      <ul className="space-y-2">
        {alerts.map((a, idx) => (
          <li key={idx} className="bg-white rounded shadow p-4">
            <p>
              <strong>{a.tableNumber}번 테이블</strong>에서{' '}
              {a.items.map(x => `${x.menuName} ${x.quantity}개`).join(', ')} 주문하셨습니다.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {dayjs(a.createdAt).format('HH:mm:ss')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

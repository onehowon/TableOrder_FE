// src/pages/OrderHistoryPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOrdersByTable } from '../api'

interface Item {
  name: string
  quantity: number
}

interface OrderDetail {
  orderId: number
  status: string
  createdAt: string
  items: Item[]
}

export default function OrderHistoryPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const [orders, setOrders]     = useState<OrderDetail[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string|null>(null)
  const [selected, setSelected] = useState<OrderDetail|null>(null)

  useEffect(() => {
    if (!tableId) {
      setError('테이블 번호가 없습니다.')
      setLoading(false)
      return
    }
    setLoading(true)
    getOrdersByTable(tableId)
      .then(res => {
        const data = res.data.data
        // 방어: orders 가 배열인지 확인
        if (Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else {
          setError('서버 응답이 올바르지 않습니다.')
        }
      })
      .catch(() => setError('주문 이력을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [tableId])

  if (loading) return <p className="text-center p-4">로딩 중…</p>
  if (error)   return <p className="text-center p-4 text-red-400">{error}</p>
  if (!orders.length) return <p className="text-center p-4">주문 이력이 없습니다.</p>

  // 최신 10개만
  const recent = orders.slice(-10).reverse()

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">테이블 {tableId} 주문 이력</h2>
      <ul className="space-y-3">
        {recent.map(order => (
          <li
            key={order.orderId}
            className="border border-zinc-700 rounded p-3 cursor-pointer hover:bg-zinc-800"
            onClick={() => setSelected(order)}
          >
            <div className="flex justify-between">
              <span>#{order.orderId} | {new Date(order.createdAt).toLocaleString()}</span>
              <span className={order.status === 'SERVED' ? 'text-green-400' : 'text-yellow-400'}>
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* 상세 모달 */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-zinc-900 text-white rounded-lg p-6 max-w-xs"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-3">주문 #{selected.orderId}</h3>
            <p className="mb-2">상태: {selected.status}</p>
            <p className="mb-2">주문시간: {new Date(selected.createdAt).toLocaleString()}</p>
            <ul className="mb-4 space-y-1">
              {selected.items.map((it, idx) => (
                <li key={idx}>{it.name} × {it.quantity}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(null)}
              className="btn-secondary w-full"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
)
}

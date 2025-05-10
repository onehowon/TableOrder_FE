// src/pages/OrderHistoryPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'
import api from '../api'

interface OrderItem {
  menuName: string
  quantity: number
}

interface OrderDetail {
  orderId: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderHistoryPage() {
  const { tableId: ctxTableId } = useTable()
  const { tableId: paramTableId } = useParams<{ tableId: string }>()
  const tableId = paramTableId ?? ctxTableId

  const [orders, setOrders] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<OrderDetail | null>(null)

  useEffect(() => {
    if (!tableId) {
      setError('테이블 번호가 없습니다.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    api
      .get(`/customer/orders/table/${tableId}`)
      .then(res => setOrders(res.data.data))
      .catch(() => setError('주문 이력을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [tableId])

  if (loading) {
    return <p className="text-center py-20 text-gray-400">로딩 중…</p>
  }
  if (error) {
    return <p className="text-center py-20 text-red-500">{error}</p>
  }
  if (orders.length === 0) {
    return <p className="text-center py-20 text-gray-400">주문 내역이 없습니다.</p>
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold text-center">테이블 {tableId} 주문 이력</h2>
      <ul className="space-y-2">
        {orders
          .slice(-10)   // 최근 10개
          .reverse()
          .map(order => (
            <li
              key={order.orderId}
              className="border border-zinc-700 rounded-xl p-4 cursor-pointer hover:bg-zinc-800"
              onClick={() => setSelected(order)}
            >
              <div className="flex justify-between">
                <span>#{order.orderId}</span>
                <span className={order.status === 'SERVED' ? 'text-green-400' : 'text-yellow-400'}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
      </ul>

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">주문 상세</h3>
            <p className="mb-2">주문번호: #{selected.orderId}</p>
            <p className="mb-2">상태: {selected.status}</p>
            <p className="mb-4">주문시간: {new Date(selected.createdAt).toLocaleString()}</p>
            <ul className="space-y-2 mb-6">
              {selected.items.map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{it.menuName}</span>
                  <span>× {it.quantity}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(null)}
              className="btn-primary w-full"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

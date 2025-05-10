import { useEffect, useState } from 'react'
import { useTable } from '../contexts/TableContext'
import api from '../api'
import { useNavigate } from 'react-router-dom'

interface OrderDetail {
  orderId: number
  tableNumber: number
  status: string
  createdAt: string
  items: { menuName: string; quantity: number }[]
}

export default function MyOrdersPage() {
  const { tableId } = useTable()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tableId) {
      setError('테이블 정보가 없습니다.')
      setLoading(false)
      return
    }

    api.get(`/customer/orders/table/${tableId}`)
      .then(res => {
        // TableOrderResponse { tableNumber, totalAmount, orders: OrderDetailDTO[] }
        setOrders(res.data.data.orders)
        setError(null)
      })
      .catch(() => setError('주문 내역을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [tableId])

  if (loading) return <p>로딩 중…</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">내 주문 내역 (테이블 {tableId})</h2>
      <ul className="space-y-4">
        {orders.map(o => (
          <li key={o.orderId} className="border rounded p-4 shadow">
            <div className="flex justify-between mb-2">
              <span>주문 #{o.orderId}</span>
              <span className="text-gray-500 text-sm">{new Date(o.createdAt).toLocaleString()}</span>
            </div>
            <p className="mb-2">상태: <strong>{o.status}</strong></p>
            <ul className="list-disc list-inside mb-2">
              {o.items.map((it, i) => (
                <li key={i}>{it.menuName} x {it.quantity}</li>
              ))}
            </ul>
            <button
              onClick={() => navigate(`/order/status/${o.orderId}`)}
              className="text-sm text-blue-600 underline"
            >
              상세 보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

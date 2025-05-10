// src/pages/OrderStatusPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'
import api from '../api'

interface StatusItem {
  menuName: string
  quantity: number
}

interface OrderStatus {
  id: number
  status: string
  items: StatusItem[]
}

export default function OrderStatusPage() {
  const { orderId: paramOrderId } = useParams<{ orderId: string }>()
  const [orderId] = useState(paramOrderId)
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('주문 번호가 없습니다.')
      setLoading(false)
      return
    }
    const fetchStatus = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/customer/orders/${orderId}`)
        setOrder(res.data.data)
      } catch {
        setError('주문 상태를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
    const timer = setInterval(fetchStatus, 5000)
    return () => clearInterval(timer)
  }, [orderId])

  if (loading) {
    return <p className="text-center py-20 text-gray-400">로딩 중…</p>
  }
  if (error) {
    return <p className="text-center py-20 text-red-500">{error}</p>
  }
  if (!order) {
    return null
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">주문 #{order.id} 상태</h2>
      <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
        <p>
          상태:{' '}
          <span className="font-semibold text-blue-400">{order.status}</span>
        </p>
        <h3 className="font-semibold">주문 내역</h3>
        <ul className="space-y-2">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between">
              <span>{it.menuName}</span>
              <span>× {it.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

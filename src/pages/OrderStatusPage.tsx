import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

interface OrderItem {
  name: string
  quantity: number
}

interface OrderStatus {
  id: number
  status: string
  items: OrderItem[]
}

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true })
      return
    }
    let timer: ReturnType<typeof setInterval>
    const fetchStatus = () => {
      setLoading(true)
      api
        .get(`/customer/orders/${orderId}`)
        .then(res => {
          setOrder(res.data.data)
          setError(null)
        })
        .catch(() => {
          setError('주문 상태를 불러오지 못했습니다.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
    fetchStatus()
    timer = setInterval(fetchStatus, 5000)
    return () => clearInterval(timer)
  }, [orderId, navigate])

  if (loading) return <p className="text-center text-gray-500">로딩 중…</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!order) return null

  return (
    <div className="px-2 py-4 max-w-lg mx-auto sm:px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">주문 상태</h2>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="text-lg font-semibold mb-2">
          상태: <span className="text-blue-700">{order.status}</span>
        </div>
        <ul className="flex flex-col gap-2">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border-b last:border-b-0 pb-1"
            >
              <span>{item.name}</span>
              <span className="font-semibold">x {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

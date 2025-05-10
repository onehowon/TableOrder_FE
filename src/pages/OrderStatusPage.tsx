import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import api                     from '../api'
import PageWrapper             from '../components/PageWrapper'

interface OrderStatus {
  id: number
  status: string
  items: { menuName: string; quantity: number }[]
}

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      if (!orderId) return
      try {
        const res = await api.get(`/customer/orders/${orderId}`)
        setOrder(res.data.data)
      } catch {
        setError('상태 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [orderId])

  if (loading) return <PageWrapper title="주문 상태"><p>로딩 중…</p></PageWrapper>
  if (error)   return <PageWrapper title="주문 상태"><p className="text-red-500">{error}</p></PageWrapper>
  if (!order)  return null

  return (
    <PageWrapper title="주문 상태">
      <p>상태: <b>{order.status}</b></p>
      <ul>
        {order.items.map((it, i) => (
          <li key={i}>{it.menuName} × {it.quantity}</li>
        ))}
      </ul>
    </PageWrapper>
  )
}

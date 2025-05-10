import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import api                     from '../api'
import PageWrapper             from '../components/PageWrapper'

interface OrderDetail {
  orderId: number
  status: string
  createdAt: string
  items: { name: string; quantity: number }[]
}

export default function OrderHistoryPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const [history, setHistory] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      if (!tableId) return
      try {
        const res = await api.get(`/customer/orders/table/${tableId}`)
        setHistory(res.data.data.orders)
      } catch {
        setError('이력을 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [tableId])

  if (loading) return <PageWrapper title="주문 이력"><p>로딩 중…</p></PageWrapper>
  if (error)   return <PageWrapper title="주문 이력"><p className="text-red-500">{error}</p></PageWrapper>

  return (
    <PageWrapper title={`테이블 ${tableId} 주문 이력`}>
      {history.length === 0 ? (
        <p>주문 이력이 없습니다.</p>
      ) : (
        <ul>
          {history.map(o => (
            <li key={o.orderId} className="mb-2">
              #{o.orderId} | {new Date(o.createdAt).toLocaleString()} | {o.status}
            </li>
          ))}
        </ul>
      )}
    </PageWrapper>
  )
}

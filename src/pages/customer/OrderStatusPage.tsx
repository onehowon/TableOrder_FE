// src/pages/customer/OrderStatusPage.tsx
import { useSearchParams, useParams } from 'react-router-dom'
import { fetchOrderStatus } from '@/api/customer'
import { useEffect, useState } from 'react'

export default function OrderStatusPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const [qs] = useSearchParams()
  const orderId = qs.get('orderId')
  const [status, setStatus] = useState<string>('')
  const [items, setItems] = useState<{ menuName: string; quantity: number; price: number }[]>([])

  useEffect(() => {
    if (!orderId) return
    fetchOrderStatus(Number(orderId))
      .then(res => {
        setStatus(res.data.data.status)
        setItems(res.data.data.items)
      })
      .catch(console.error)
  }, [orderId])

  if (!orderId) return <p className="p-4">잘못된 접근입니다.</p>

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">주문 상태</h1>
      <p className="text-lg">주문 번호: {orderId}</p>
      <p className="mb-4">현재 상태: <b>{status}</b></p>
      <ul className="space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{i.menuName} x {i.quantity}</span>
            +    <span>
                {i.price != null && i.quantity != null
                    ? (i.price * i.quantity).toLocaleString() + '원'
                    : '-'}
                </span>
          </li>
        ))}
      </ul>
      <div className="text-right font-semibold">
        합계 {total.toLocaleString()}원
      </div>
    </div>
  )
}

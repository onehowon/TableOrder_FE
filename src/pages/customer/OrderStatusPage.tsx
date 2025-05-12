import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAlerts, listOrders } from '../../api'
import type { OrderDetailDTO } from '../../api'

export default function OrderStatusPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()
  const [order, setOrder] = useState<OrderDetailDTO | null>(null)
  const [done, setDone] = useState(false)

  // 3초마다 현황 조회
  useEffect(() => {
    const iv = setInterval(async () => {
      const res = await listOrders()
      const my = res.data.data.find(o => o.tableNumber === Number(tableNumber))
      if (my) {
        setOrder(my)
        if (my.status === 'SERVED') {
          setDone(true)
          clearInterval(iv)
        }
      }
    }, 3000)
    return () => clearInterval(iv)
  }, [tableNumber])

  if (!order) {
    return <div className="p-4 text-center">주문 정보를 불러오는 중...</div>
  }

  if (!done) {
    // 조리 중 화면
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-4">
        <img src="/logo.png" alt="Engine" className="h-12 mb-12" />
        <h1 className="text-2xl font-bold mb-6 text-center">
          조리 중...
        </h1>
        <ul className="text-center space-y-2 mb-6">
          {order.items.map((it, i) => (
            <li key={i}>{it.name} × {it.quantity}</li>
          ))}
        </ul>
        <button
          onClick={() => nav(`/customer/${tableNumber}/summary`)}
          className="text-sm text-gray-600 underline"
        >
          ← 이전 화면
        </button>
      </div>
    )
  }

  // 조리 완료 화면
  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-4">
      <img src="/logo.png" alt="Engine" className="h-12 mb-12" />
      <h1 className="text-2xl font-bold mb-6 text-center">
        조리 완료!
      </h1>
      <button
        onClick={() => nav(`/customer/${tableNumber}/summary`)}
        className="py-2 px-4 bg-green-600 text-white rounded"
      >
        ← 이전 화면
      </button>
    </div>
  )
}

// src/pages/MyOrdersPage.tsx
import { useEffect, useState } from 'react'
import { useTable } from '../contexts/TableContext'
import { useNavigate } from 'react-router-dom'
import api from '../api'

interface Item { menuName:string; quantity:number }
interface OrderDetail {
  orderId:number; status:string; createdAt:string|null; items:Item[]
}

export default function MyOrdersPage() {
  const { tableId } = useTable()
  const nav = useNavigate()
  const [lst, setLst]     = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string|null>(null)

  useEffect(() => {
    if (!tableId) {
      setError('테이블 정보가 없습니다.')
      return setLoading(false)
    }
    api.get(`/customer/orders/table/${tableId}`)
       .then(r => setLst(r.data.data.orders))
       .catch(() => setError('불러오지 못했습니다.'))
       .finally(()=>setLoading(false))
  }, [tableId])

  if (loading) return <p>로딩 중…</p>
  if (error)   return <p className="text-red-500">{error}</p>

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">내 주문 현황 (테이블 {tableId})</h2>
      <ul className="space-y-4">
        {lst.map(o=>(
          <li key={o.orderId} className="border rounded p-3 shadow">
            <div className="flex justify-between">
              <span>#{o.orderId}</span>
              <span className="text-gray-500 text-sm">
                {o.createdAt && new Date(o.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mb-1">상태: <strong>{o.status}</strong></p>
            <ul className="list-disc pl-5 mb-2">
              {o.items.map((i,idx)=>(
                <li key={idx}>{i.menuName} x {i.quantity}</li>
              ))}
            </ul>
            <button
              className="text-blue-600 underline text-sm"
              onClick={()=> nav(`/order/status/${o.orderId}`)}
            >
              상세 보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

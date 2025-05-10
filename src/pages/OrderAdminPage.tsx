// src/pages/OrderAdminPage.tsx
import { useEffect, useState } from 'react'
import {
  getAdminOrders,
  updateAdminOrderStatus
} from '../api'

interface AdminOrder {
  id:number
  tableId:number
  status:'WAITING'|'COOKING'|'SERVED'
  totalAmount:number
  items:{ menuName:string; quantity:number }[]
  createdAt:string
}

export default function OrderAdminPage() {
  const [orders,  setOrders]  = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = () => {
    setLoading(true)
    getAdminOrders()
      .then(r=>setOrders(r.data.data))
      .finally(()=>setLoading(false))
  }
  useEffect(fetch,[])

  const onUpdate = async (id:number, status:'COOKING'|'SERVED') => {
    await updateAdminOrderStatus(id,status)
    fetch()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">주문 관리</h2>
      {loading && <p className="text-center">로딩중…</p>}
      <ul className="space-y-6">
        {orders.map(o=>(
          <li key={o.id} className="border border-zinc-700 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span>#{o.id} • 테이블 {o.tableId}</span>
              <span className="text-blue-400 font-semibold">{o.status}</span>
            </div>
            <ul className="text-sm mb-3">
              {o.items.map((it,i)=>(
                <li key={i}>{it.menuName} × {it.quantity}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              {o.status==='WAITING' && (
                <button
                  onClick={()=>onUpdate(o.id,'COOKING')}
                  className="btn-secondary flex-1">
                  COOKING
                </button>
              )}
              {o.status!=='SERVED' && (
                <button
                  onClick={()=>onUpdate(o.id,'SERVED')}
                  className="btn-primary flex-1">
                  SERVED
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

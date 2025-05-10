import { useEffect, useState } from 'react'
import api from '../api'

interface Item  { menuName:string; quantity:number }
interface Order { id:number; tableNumber:number; totalAmount:number; status:string; estimatedTime?:number; items:Item[] }

export default function OrderAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [eta,    setEta]    = useState<Record<number,string>>({})

  const fetchOrders = () =>
    api.get('/admin/orders').then(r => setOrders(r.data.data))

  useEffect(() => {
    fetchOrders()
    const iv = setInterval(fetchOrders, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">주문 관리</h2>
      {orders.map(o => (
        <div key={o.id} className="border rounded p-4 mb-4">
          <p>테이블 {o.tableNumber} | 금액 {o.totalAmount.toLocaleString()}원</p>
          <p>상태: {o.status} {o.estimatedTime && `(ETA: ${o.estimatedTime}분)`}</p>
          <ul className="pl-4">
            {o.items.map((i, idx) =>
              <li key={idx}>{i.menuName} x {i.quantity}</li>
            )}
          </ul>

          {o.status === 'WAITING' && (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="예상(분)"
                value={eta[o.id]||''}
                onChange={e =>
                  setEta(prev => ({ ...prev, [o.id]: e.target.value }))
                }
                className="border px-2 py-1"
              />
              <button
                className="bg-blue-600 text-white px-3 rounded"
                onClick={() => {
                  api.put(`/admin/orders/${o.id}/status`, {
                    status: 'COOKING',
                    estimatedTime: Number(eta[o.id]||0)
                  }).then(fetchOrders)
                }}
              >
                조리 시작
              </button>
            </div>
          )}

          {o.status === 'COOKING' && (
            <button
              className="mt-2 bg-green-600 text-white px-3 rounded"
              onClick={() => {
                api.put(`/admin/orders/${o.id}/status`, {
                  status: 'SERVED',
                  estimatedTime: null
                }).then(fetchOrders)
              }}
            >
              서빙 완료
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

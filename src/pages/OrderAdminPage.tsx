import { useEffect, useState } from 'react'
import api from '../api'

interface Item {
  menuName: string
  quantity: number
}

interface Order {
  id: number
  tableId: number
  status: string
  createdAt?: string
  items: Item[]
}

export default function OrderAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get('/admin/orders').then(res => setOrders(res.data.data))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 24 }}>주문 관리</h2>

      <ul style={{ padding: 0 }}>
        {orders.map(o => (
          <li
            key={o.id}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>
                #{o.id} | {o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}
              </span>
              <span>{o.status}</span>
            </div>

            <ul>
              {o.items.map((it, idx) => (
                <li key={idx}>
                  {it.menuName} x {it.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

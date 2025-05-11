// src/pages/admin/OrderAdminPage.tsx
import { useEffect, useState } from 'react'
import { listOrders, updateOrderStatus, OrderDetailDTO } from '@/api'

export default function OrderAdminPage() {
  const [orders, setOrders]   = useState<OrderDetailDTO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await listOrders()
        setOrders(res.data.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const changeStatus = async (orderId: number, status: 'PREPARING'|'DONE') => {
    await updateOrderStatus(orderId, { status })
    const res = await listOrders()
    setOrders(res.data.data)
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Order ID</th><th>Table</th><th>Items</th><th>Status</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.orderId}>
            <td>{o.orderId}</td>
            <td>{o.tableNumber}</td>
            <td>
              {o.items.map(x => `${x.menuName} x${x.quantity}`).join(', ')}
            </td>
            <td>{o.status}</td>
            <td>
              <button onClick={() => changeStatus(o.orderId, 'PREPARING')}>
                준비중
              </button>
              <button onClick={() => changeStatus(o.orderId, 'DONE')}>
                완료
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

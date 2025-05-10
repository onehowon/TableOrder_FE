import { useEffect, useState } from 'react'
import api from '../api'

interface OrderItem {
  menuName: string
  quantity: number
}

interface Order {
  id: number
  tableNumber: number
  totalAmount: number
  status: string
  items: OrderItem[]
}

export default function OrderAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])

  const fetchOrders = () => {
    api
      .get('/admin/orders')
      .then(res => setOrders(res.data.data || []))
      .catch(() => alert('주문 목록을 불러오지 못했습니다.'))
  }

  const markAsServed = (orderId: number) => {
    api
      .put('/admin/orders/' + orderId + '/status', { status: 'SERVED' })
      .then(fetchOrders)
      .catch(() => alert('상태 변경에 실패했습니다.'))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        주문 관리
      </h2>
      <ul style={{ padding: 0 }}>
        {orders.map(order => (
          <li
            key={order.id}
            style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}
          >
            <p>테이블: {order.tableNumber}</p>
            <p>총 금액: {order.totalAmount.toLocaleString()}원</p>
            <p>상태: {order.status}</p>
            <ul style={{ fontSize: 14, marginTop: 8 }}>
              {order.items.map((it, i) => (
                <li key={i}>
                  {it.menuName} x {it.quantity}
                </li>
              ))}
            </ul>
            {order.status !== 'SERVED' && (
              <button
                onClick={() => markAsServed(order.id)}
                style={{
                  marginTop: 8,
                  padding: '4px 12px',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                }}
              >
                완료 처리
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

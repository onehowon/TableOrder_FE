import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

interface OrderItem {
  name: string
  quantity: number
}

interface OrderDetail {
  orderId: number
  status: string
  createdAt: string | null
  items: OrderItem[]
}

interface TableOrderHistory {
  tableNumber: number
  totalAmount: number
  orders: OrderDetail[]
}

export default function OrderHistoryPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const [history, setHistory] = useState<TableOrderHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<OrderDetail | null>(null)

  useEffect(() => {
    if (!tableId) return
    setLoading(true)
    setError(null)
    api
      .get(`/customer/orders/table/${tableId}`)
      .then(res => setHistory(res.data.data))
      .catch(() => setError('주문 이력을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [tableId])

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
        테이블 {tableId} 주문 이력
      </h2>
      {loading && <p>로딩 중…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {history && history.orders.length === 0 && <p>주문 이력이 없습니다.</p>}
      {history && history.orders.length > 0 && (
        <ul style={{ padding: 0 }}>
          {history.orders.slice(-10).reverse().map(order => (
            <li
              key={order.orderId}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                cursor: 'pointer',
              }}
              onClick={() => setSelected(order)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  #{order.orderId} |{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : '-'}
                </span>
                <span
                  style={{
                    color: order.status === 'SERVED' ? '#22c55e' : '#888',
                  }}
                >
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 20, marginBottom: 16 }}>주문 상세</h3>
            <div style={{ marginBottom: 12 }}>
              주문번호: #{selected.orderId}
            </div>
            <div style={{ marginBottom: 12 }}>상태: {selected.status}</div>
            <div style={{ marginBottom: 12 }}>
              주문시간:{' '}
              {selected.createdAt
                ? new Date(selected.createdAt).toLocaleString()
                : '-'}
            </div>
            <ul style={{ marginBottom: 12 }}>
              {selected.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: 8,
                background: '#2563eb',
                color: 'white',
                padding: '8px 24px',
                border: 'none',
                borderRadius: 8,
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

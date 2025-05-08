import { useEffect, useState } from 'react';
import api from '../api';

interface Order {
  id: number;
  tableId: number;
  totalAmount: number;
  status: string; // 예: 'CREATED', 'SERVED'
  items: {
    menuName: string;
    quantity: number;
  }[];
}

export default function OrderAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    api.get('/admin/orders')
      .then(res => setOrders(res.data.data))
      .catch(console.error);
  };

  const markAsServed = (orderId: number) => {
    api.put(`/orders/${orderId}/served`)
      .then(fetchOrders)
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>주문 관리</h2>
      <ul style={{ padding: 0 }}>
        {orders.map(order => (
          <li key={order.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
            <p>테이블: {order.tableId}</p>
            <p>총 금액: {order.totalAmount.toLocaleString()}원</p>
            <p>상태: {order.status}</p>
            <ul style={{ fontSize: 14, marginTop: 8 }}>
              {order.items.map((item, i) => (
                <li key={i}>{item.menuName} x {item.quantity}</li>
              ))}
            </ul>
            {order.status !== 'SERVED' && (
              <button onClick={() => markAsServed(order.id)} style={{ marginTop: 8, padding: '4px 12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 4 }}>
                완료 처리
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 
import { useState } from 'react';
import api from '../api';

interface OrderItem {
  menuName: string;
  quantity: number;
  status: string;
}

export default function TableOrderPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    if (!tableNumber) {
      setError('테이블 번호를 입력하세요.');
      return;
    }
    setLoading(true);
    setError(null);
    api.get(`/customer/orders/table/${tableNumber}`)
      .then(res => {
        setOrders(res.data.data.items || []);
        setError(null);
      })
      .catch(() => setError('주문 내역을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>테이블 주문 내역 조회</h1>
      <div style={{ marginBottom: 16 }}>
        <input
          type="number"
          placeholder="테이블 번호"
          value={tableNumber}
          onChange={e => setTableNumber(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', marginRight: 8 }}
        />
        <button onClick={fetchOrders} style={{ padding: '8px 16px' }}>조회</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>로딩 중...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.length === 0 ? <li>주문 내역이 없습니다.</li> : orders.map((item, idx) => (
            <li key={idx} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 8, marginBottom: 8 }}>
              <p><b>{item.menuName}</b> x {item.quantity}</p>
              <p>상태: {item.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
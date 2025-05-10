import { useEffect, useState } from 'react';
import { useParams }                  from 'react-router-dom';
import api                            from '../api';

interface OrderItem {
  menuName: string;
  quantity: number;
}

interface OrderDetail {
  orderId: number;
  status: string;
  createdAt: string | null;
  items: OrderItem[];
}

interface TableOrderHistory {
  tableNumber: number;
  totalAmount: number;
  orders: OrderDetail[];
}

export default function OrderHistoryPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const [hist, setHist]     = useState<TableOrderHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [sel, setSel]         = useState<OrderDetail | null>(null);

  useEffect(() => {
    const fetchHist = async () => {
      if (!tableId) {
        setError('테이블 정보가 없습니다.');
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/customer/orders/table/${tableId}`);
        setHist(res.data.data);
      } catch {
        setError('불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchHist();
  }, [tableId]);

  if (loading) return <p>로딩 중…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;
  if (!hist || hist.orders.length === 0) return <p>주문 이력이 없습니다.</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        테이블 {tableId} 주문 이력
      </h2>
      <ul className="space-y-3">
        {hist.orders.slice(-10).reverse().map(o => (
          <li
            key={o.orderId}
            className="border rounded p-3 cursor-pointer"
            onClick={() => setSel(o)}
          >
            <div className="flex justify-between">
              <span>#{o.orderId}</span>
              <span className="text-gray-500 text-sm">
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}
              </span>
            </div>
            <div>상태: <strong>{o.status}</strong></div>
          </li>
        ))}
      </ul>

      {sel && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center"
          onClick={() => setSel(null)}
        >
          <div
            className="bg-white rounded p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg mb-2">
              주문 상세 #{sel.orderId}
            </h3>
            <p>상태: {sel.status}</p>
            <p>
              시간:{' '}
              {sel.createdAt
                ? new Date(sel.createdAt).toLocaleString()
                : '-'}
            </p>
            <ul className="list-disc pl-5">
              {sel.items.map((i, idx) => (
                <li key={idx}>
                  {i.menuName} x {i.quantity}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setSel(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

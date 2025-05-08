import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderDetail {
  orderId: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface TableSummary {
  tableNumber: number;
  totalAmount: number;
  orders: OrderDetail[];
}

export default function TableSummaryPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const [summary, setSummary] = useState<TableSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/customer/orders/table/${tableId}`)
      .then(res => setSummary(res.data.data))
      .catch(() => setError('요약 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [tableId]);

  // 메뉴별 합계 계산
  const menuSummary: Record<string, { quantity: number }> = {};
  let lastOrderTime = '';
  if (summary) {
    summary.orders.forEach(order => {
      order.items.forEach(item => {
        if (!menuSummary[item.name]) menuSummary[item.name] = { quantity: 0 };
        menuSummary[item.name].quantity += item.quantity;
      });
      if (!lastOrderTime || order.createdAt > lastOrderTime) lastOrderTime = order.createdAt;
    });
  }

  return (
    <div className="px-2 py-4 max-w-lg mx-auto sm:px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">테이블 {tableId} 요약</h2>
      {loading && <p className="text-center text-gray-500">로딩 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {summary && (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <div className="mb-4">
            <b>총 주문 금액:</b> <span className="text-blue-700 font-semibold">{summary.totalAmount.toLocaleString()}원</span><br />
            <b>최종 주문 시간:</b> <span>{lastOrderTime ? new Date(lastOrderTime).toLocaleString() : '-'}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">메뉴별 합계</h3>
          <ul className="flex flex-col gap-2 mb-4">
            {Object.entries(menuSummary).map(([name, { quantity }]) => (
              <li key={name} className="flex justify-between items-center border-b last:border-b-0 pb-1">
                <span>{name}</span>
                <span className="font-semibold">x {quantity}개</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/menu')}
            className="bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition"
          >
            다시 주문하기
          </button>
        </div>
      )}
    </div>
  );
} 
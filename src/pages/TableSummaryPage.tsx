import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }      from 'react-router-dom';
import api                              from '../api';

interface ItemSummary {
  name: string;
  quantity: number;
  totalPrice: number;
}

interface TableSummaryResponse {
  tableNumber: number;
  totalOrders: number;
  totalAmount: number;
  items: ItemSummary[];
}

export default function TableSummaryPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate    = useNavigate();

  const [summary, setSummary] = useState<TableSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!tableId) {
        setError('테이블 정보가 없습니다.');
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/customer/tables/${tableId}/summary`);
        setSummary(res.data.data);
      } catch {
        setError('요약 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [tableId]);

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (error)   return <p className="text-center text-red-500">{error}</p>;
  if (!summary) return null;

  return (
    <div className="px-2 py-4 max-w-lg mx-auto sm:px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        테이블 {summary.tableNumber} 요약
      </h2>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="space-y-1">
          <p>총 주문 건수: {summary.totalOrders}회</p>
          <p>
            총 주문 금액:{' '}
            <span className="text-blue-700 font-semibold">
              {summary.totalAmount.toLocaleString()}원
            </span>
          </p>
        </div>
        <h3 className="text-lg font-semibold">메뉴별 합계</h3>
        <ul className="flex flex-col gap-2 mb-4">
          {summary.items.map(item => (
            <li
              key={item.name}
              className="flex justify-between border-b last:border-b-0 pb-1"
            >
              <div>
                <span>{item.name}</span>{' '}
                <span className="text-gray-500 text-sm">
                  ({item.totalPrice.toLocaleString()}원)
                </span>
              </div>
              <div>
                <span className="font-semibold">
                  × {item.quantity}개
                </span>
              </div>
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
    </div>
  );
}

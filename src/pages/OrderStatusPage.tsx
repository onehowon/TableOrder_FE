import { useEffect, useState } from 'react';
import { useParams }                  from 'react-router-dom';
import api                            from '../api';

interface Item {
  menuName: string;
  quantity: number;
}

interface Status {
  status: string;
  estimatedTime?: number;
  items: Item[];
}

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData]     = useState<Status | null>(null);
  const [remain, setRemain] = useState<number | null>(null);

  // 상태 폴링
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      try {
        const res = await api.get(`/customer/orders/${orderId}`);
        const d: Status = res.data.data;
        setData(d);
        setRemain(d.estimatedTime ?? null);
      } catch (err) {
        console.error(err);
      }
    };

    if (orderId) {
      fetchStatus();
      iv = setInterval(fetchStatus, 5000);
    }
    return () => {
      if (iv) clearInterval(iv);
    };
  }, [orderId]);

  // 남은 시간 카운트다운
  useEffect(() => {
    if (remain !== null && remain > 0) {
      const to = setTimeout(() => setRemain(r => (r !== null ? r - 1 : null)), 60000);
      return () => clearTimeout(to);
    }
  }, [remain]);

  if (!data) return <p className="text-center mt-10">로딩 중…</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">주문 상태</h2>
      <p className="mb-2">
        상태: <strong>{data.status}</strong>
      </p>
      {remain !== null && (
        <p className="mb-4">
          남은 시간: <strong>{remain}분</strong>
        </p>
      )}
      <ul className="list-disc pl-5">
        {data.items.map((i, idx) => (
          <li key={idx}>
            {i.menuName} x {i.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

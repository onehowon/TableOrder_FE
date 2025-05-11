// src/pages/customer/WelcomePage.tsx
import { useNavigate, useParams } from 'react-router-dom';

export default function WelcomePage() {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const nav = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">IBIZ 주점에 오신 걸 환영합니다! 여기는 테이블 {tableNumber} 번입니다!</h1>
      <button
        className="btn-primary w-full"
        onClick={() => nav(`/customer/${tableNumber}/menu`)}
      >
        메뉴 보기
      </button>
      <button
        className="btn-outline w-full"
        onClick={() => nav(`/customer/${tableNumber}/orders`)}
      >
        주문 현황
      </button>
      <button
        className="btn-outline w-full"
        onClick={() => nav(`/customer/${tableNumber}/summary`)}
      >
        테이블 요약
      </button>
    </div>
  )
}

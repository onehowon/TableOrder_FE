// src/pages/customer/WelcomePage.tsx
import { useParams, useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const { tableNumber } = useParams<{tableNumber: string}>()
  const nav = useNavigate()

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">환영합니다!</h2>
      <p className="mb-4">테이블 {tableNumber}에 오신 걸 환영합니다.</p>
      <button
        onClick={() => nav(`menu`)}
        className="btn-primary px-4 py-2"
      >
        메뉴 보러 가기
      </button>
    </div>
  )
}

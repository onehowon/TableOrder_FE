// src/pages/customer/OrderPlacedPage.tsx
import { useNavigate, useParams } from 'react-router-dom'
import engineLogo from '../../assets/engine.png'

export default function OrderPlacedPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()

  const goHome = () => {
    nav(`/customer/${tableNumber}`, { replace: true })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-4 space-y-8">

      {/* 로고 */}
      <img src={engineLogo} alt="EngiNE" className="w-32 h-auto" />

      {/* 주문 완료 메시지 */}
      <p className="text-2xl font-extrabold text-center">
        주문이 정상 접수되었습니다!
      </p>

      {/* 메인으로 돌아가기 버튼 */}
      <button
        onClick={goHome}
        className="mt-8 w-full max-w-xs py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700 transition"
      >
        메인으로 돌아가기
      </button>
    </div>
  )
}

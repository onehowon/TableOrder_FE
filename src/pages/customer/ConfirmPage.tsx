import { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { postRequest } from '../../api'

interface LocationState {
  cart: Record<number, number>
}

export default function ConfirmPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const { state } = useLocation() as { state: LocationState }
  const nav = useNavigate()

  useEffect(() => {
    async function submitOrder() {
      try {
        // 백엔드에 주문 요청
        await postRequest({
          tableNumber: Number(tableNumber),
          type: 'ORDER',
          items: Object.entries(state.cart).map(([menuId, qty]) => ({
            menuId: Number(menuId),
            quantity: qty
          }))
        })
        // 2초 뒤 주문 현황 페이지로 이동
        setTimeout(() => {
          nav(`/customer/${tableNumber}/orders`, { replace: true })
        }, 2000)
      } catch {
        alert('주문 전송에 실패했습니다.')
        nav(-1)
      }
    }
    submitOrder()
  }, [tableNumber, state.cart, nav])

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-4">
      <img src="/logo.png" alt="Engine" className="h-12 mb-12" />
      <h1 className="text-2xl font-bold mb-6 text-center">
        주문이 정상<br/>접수되었습니다!
      </h1>
      <div className="animate-spin mb-6">
        {/* 로딩 스피너 */}
        <svg className="w-12 h-12 text-green-600" viewBox="0 0 50 50">
          <circle
            className="opacity-25"
            cx="25" cy="25" r="20"
            stroke="currentColor" strokeWidth="5" fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 0 0-15-15V5z"
          />
        </svg>
      </div>
      <p className="text-base text-gray-600">조리 중...</p>
    </div>
  )
}

// src/pages/customer/StartPage.tsx
import { useNavigate, useParams } from 'react-router-dom'
import { postRequest } from '../../api'
import logoSrc from '../../assets/engine.png'

export default function StartPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()

  const goOrder = () => {
    nav(`/customer/${tableNumber}/menu`)
  }

  const callStaff = async () => {
    try {
      await postRequest({
        tableNumber: Number(tableNumber)
        })
      alert('직원 호출이 전송되었습니다.')
    } catch {
      alert('직원 호출에 실패했습니다.')
    }
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center pt-12 px-4 font-woowahan">
      {/* 1) 로고 */}
      <img src={logoSrc} alt="Engine Logo" className="h-12 mb-12 object-contain" />

      {/* 안내문 */}
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <p className="text-base leading-relaxed">
          원하시는 상품을 수량에 맞게 장바구니에 담고<br/>
          금액을 송금해주신 후 직원에게 확인시켜주시면 됩니다!
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div className="w-full max-w-xs mx-auto mb-12 space-y-3 px-4">
        <button
          onClick={goOrder}
          className="w-full h-12 bg-green-600 text-white rounded-xl text-lg font-medium shadow hover:bg-green-700 transition"
        >
          주문하기
        </button>
        <button
          onClick={callStaff}
          className="w-full h-12 bg-red-400 text-white rounded-xl text-lg font-medium shadow hover:bg-red-500 transition"
        >
          직원호출
        </button>
      </div>
    </div>
  )
}

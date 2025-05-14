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
      await postRequest({ tableNumber: Number(tableNumber) })
      alert('직원 호출이 전송되었습니다.')
    } catch {
      alert('직원 호출에 실패했습니다.')
    }
  }

  return (
    <div className="relative w-full h-screen bg-white flex flex-col items-center justify-center px-4 font-woowahan">
      {/* 1) 로고: 우측 상단 */}
      <img
        src={logoSrc}
        alt="Engine Logo"
        className="absolute top-4 right-4 h-12 object-contain"
      />

      {/* 2) 카드 컨테이너 */}
      <div className="relative w-full max-w-md mt-8">
        {/* 그레이 배경 박스 */}
        <div className="bg-gray-100 rounded-2xl pt-8 pb-6 px-6">
          {/* 커스텀 숫자 리스트 */}
          <ul className="space-y-3">
            {[
              '메뉴에서 음식을 고른다!',
              '수량에 맞게 장바구니에 담는다!',
              '금액 송금 후 직원에게 확인!',
              '주문 버튼을 누르면 끝!!',
            ].map((text, i) => (
              <li
                key={i}
                className="flex items-center space-x-3 text-base text-gray-800"
              >
                <span className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 그린 캡슐 헤더: 회색 박스 위에 절반 오버랩 */}
        <div
          className="
            absolute top-0 left-1/2 
            transform -translate-x-1/2 -translate-y-1/2 
            bg-green-600 text-white 
            rounded-full px-6 py-2 
            flex items-center space-x-2 
            text-lg font-semibold 
            shadow-md
            z-10
          "
        >
          <span>📄</span>
          <span>주문방법</span>
        </div>
      </div>

      {/* 3) 버튼 그룹 */}
      <div className="w-full max-w-md mt-8 space-y-4">
        <button
          onClick={goOrder}
          className="w-full h-14 bg-green-600 text-white rounded-full text-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
        >
          주문하기
        </button>
        <button
          onClick={callStaff}
          className="w-full h-14 bg-red-400 text-white rounded-full text-lg font-semibold shadow-md hover:bg-red-500 transition-colors"
        >
          직원호출
        </button>
      </div>
    </div>
  )
}

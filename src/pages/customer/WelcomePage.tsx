import { useNavigate, useParams } from 'react-router-dom'
import logoSrc from '../../assets/engine.png'

export default function WelcomePage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()

  const onStart = () => {
    nav(`/customer/${tableNumber}/start`)
  }

  return (
    <div className="relative w-full h-screen bg-white flex flex-col items-center justify-center px-4 font-woowahan">
      {/* 1) 로고: 우측 상단 고정 */}
      <img
        src={logoSrc}
        alt="Engine Logo"
        className="absolute top-4 right-4 h-12 object-contain"
      />

      {/* 2) 타이틀: '아이비즈'만 색 입히기, 폰트 키우기 */}
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center mb-8">
        <span className="text-green-600">아이비즈</span>의<br />
        폭싹 속았슈퍼
      </h1>

      {/* 3) 시작하기 버튼: 완전 둥근 형태, 텍스트도 큼직하게 */}
      <button
        onClick={onStart}
        className="w-full max-w-md h-16 bg-green-600 text-white rounded-full text-2xl font-semibold shadow-md hover:bg-green-700 transition-colors"
      >
        시작하기
      </button>
    </div>
  )
}

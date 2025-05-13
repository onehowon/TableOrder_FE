import { useNavigate, useParams } from 'react-router-dom'
import logoSrc from '../../assets/engine.png'

export default function WelcomePage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()

  const onStart = () => {
    nav(`/customer/${tableNumber}/start`)
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center pt-12 px-4 font-woowahan">
      {/* 1) 로고 */}
      <img src={logoSrc} alt="Engine Logo" className="h-12 mb-12 object-contain" />

      {/* 2) 타이틀 */}
      <h1 className="text-3xl font-extrabold leading-tight text-center mb-16">
        아이비즈의<br/>
        폭싹 속았슈퍼
      </h1>

      <div className="w-full max-w-md mx-auto">
        <button
          onClick={onStart}
          className="w-full h-14 bg-green-600 text-white rounded-lg text-xl font-semibold shadow hover:bg-green-700 transition"
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
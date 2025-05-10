import { useNavigate } from 'react-router-dom'
import { useTable }    from '../contexts/TableContext'

export default function WelcomePage() {
  const { tableId } = useTable()
  const nav         = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">어서오세요 👋</h1>

      <p className="text-gray-600 mb-8 leading-relaxed">
        테이블 <span className="font-semibold">{tableId}</span>번입니다.<br />
        아래 메뉴를 선택해 주세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
        <button
          onClick={() => nav('/menu')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-4 font-semibold"
        >
          주문하기
        </button>

        <button
          onClick={() => nav(`/orders/history/${tableId}`)}
          className="flex-1 bg-slate-700 hover:bg-slate-800 text-white rounded-lg px-6 py-4 font-semibold"
        >
          영수증&nbsp;/&nbsp;과거 주문
        </button>
      </div>
    </div>
  )
}

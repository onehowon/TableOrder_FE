// src/pages/WelcomePage.tsx
import { useTable } from '../contexts/TableContext'
import { useNavigate } from 'react-router-dom'
import { postCustomerRequest } from '../api'

export default function WelcomePage() {
  const { tableId } = useTable()
  const nav = useNavigate()

  const call = async (type: 'WATER'|'TISSUE'|'CHOPSTICKS'|'CALL') => {
    if (!tableId) return alert('테이블 번호가 없습니다.')
    try {
      await postCustomerRequest({ tableNumber: Number(tableId), type })
      alert('요청이 전송되었습니다!')
    } catch {
      alert('전송 실패. 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
      <h1 className="text-4xl font-bold">어서오세요 👋</h1>
      <p>테이블 {tableId}번입니다.</p>

      <div className="flex gap-4">
        <button onClick={() => nav('/menu')} className="btn-primary">주문하기</button>
        <button onClick={() => nav(`/orders/history/${tableId}`)} className="btn-secondary">
          영수증 / 과거 주문
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        <button onClick={() => call('WATER')}      className="btn-call">물 주세요</button>
        <button onClick={() => call('TISSUE')}     className="btn-call">티슈</button>
        <button onClick={() => call('CHOPSTICKS')} className="btn-call">젓가락</button>
        <button onClick={() => call('CALL')}       className="btn-call">직원 호출</button>
      </div>
    </div>
  )
}

// src/pages/customer/WelcomePage.tsx
import { useNavigate } from 'react-router-dom'
import { useTable } from '@/contexts/TableContext'

export default function WelcomePage() {
  const { tableId } = useTable()
  const nav = useNavigate()

  return (
    <div className="p-4 space-y-6 text-center">
      <h2 className="text-2xl font-bold">IBIZ 주점에 오신 걸 환영합니다!</h2>
      <p>여기는 테이블 {tableId}번입니다.</p>
      <div className="space-x-4">
        <button onClick={()=>nav(`menu`)}    className="btn-primary">메뉴 보기</button>
        <button onClick={()=>nav(`orders`)}  className="btn-secondary">주문 현황</button>
        <button onClick={()=>nav(`summary`)} className="btn-secondary">테이블 요약</button>
        <button onClick={()=>nav(`request`)} className="btn-secondary">직원 부르기</button>
      </div>
    </div>
  )
}

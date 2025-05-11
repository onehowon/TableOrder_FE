// src/components/CustomerNav.tsx
import { NavLink, useParams } from 'react-router-dom'

export default function CustomerNav() {
  const { tableNumber } = useParams<{ tableNumber: string }>()

  return (
    <nav className="flex space-x-4 p-4 bg-white shadow">
      <NavLink to={`/customer/${tableNumber}/menu`}>메뉴</NavLink>
      <NavLink to={`/customer/${tableNumber}/orders`}>주문 현황</NavLink>
      <NavLink to={`/customer/${tableNumber}/summary`}>테이블 요약</NavLink>
      <NavLink to={`/customer/${tableNumber}/request`}>요청하기</NavLink>
    </nav>
  )
}

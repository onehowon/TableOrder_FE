// src/pages/customer/CustomerLayout.tsx
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom'
import { useTable } from '@/contexts/TableContext'
import CartMiniWidget from '@/components/CartMiniWidget'  // 장바구니 위젯
import React from 'react'

export default function CustomerLayout() {
  const { tableNumber } = useParams<{tableNumber: string}>()
  const { tableId, setTableId } = useTable()
  const nav = useNavigate()

  // URL에 따라 context 세팅
  React.useEffect(() => {
    if (tableNumber && tableNumber !== tableId) {
      setTableId(tableNumber)
    }
  }, [tableNumber, tableId, setTableId])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      <header className="p-4 bg-white shadow sticky top-0 z-10">
        <h1 className="text-xl font-bold">IBIZ 주점 — 테이블 {tableNumber}</h1>
        <nav className="mt-2 space-x-4 text-sm">
          <NavLink to="menu"    className={({isActive})=> isActive? 'font-bold':'underline'}>메뉴 보기</NavLink>
          <NavLink to="orders"  className={({isActive})=> isActive? 'font-bold':'underline'}>주문 현황</NavLink>
          <NavLink to="summary" className={({isActive})=> isActive? 'font-bold':'underline'}>테이블 요약</NavLink>
          <NavLink to="request" className={({isActive})=> isActive? 'font-bold':'underline'}>직원 부르기</NavLink>
        </nav>
      </header>

      <main className="pt-4">
        <Outlet />
      </main>

      <CartMiniWidget />
    </div>
  )
}

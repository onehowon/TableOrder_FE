// ─ src/pages/customer/CustomerLayout.tsx ───────────────────────
import React, { useEffect } from 'react'
import { Outlet, useParams, useNavigate, NavLink } from 'react-router-dom'
import { useTable } from '@/contexts/TableContext'
import CartMiniWidget from '@/components/CartMiniWidget'

export default function CustomerLayout() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const { tableId, setTableId } = useTable()
  const nav = useNavigate()

  useEffect(() => {
    if (tableNumber && tableNumber !== tableId) {
      setTableId(tableNumber)
    }
  }, [tableNumber, tableId, setTableId])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      <header className="p-4 bg-white shadow sticky top-0 z-10">
        <h1 className="text-xl font-bold">IBIZ에 오신 걸 환영합니다!</h1>
        <p className="text-sm text-gray-600">
          여기는 테이블 <b>{tableNumber}</b> 번입니다.
        </p>
        <nav className="mt-2 space-x-4 text-blue-600">
          <NavLink to=""               end   className="hover:underline">메뉴 보기</NavLink>
          <NavLink to="orders"        className="hover:underline">주문 현황</NavLink>
          <NavLink to="summary"       className="hover:underline">테이블 요약</NavLink>
          <NavLink to="request"       className="hover:underline">직원 부르기</NavLink>
        </nav>
      </header>

      <main className="pt-4">
        <Outlet />
      </main>

      {/* 공통: 우측 하단에 Mini Cart */}
      <CartMiniWidget />
    </div>
  )
}

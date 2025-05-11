// src/pages/customer/CustomerLayout.tsx
import React, { useEffect } from 'react'
import { Outlet, useParams }      from 'react-router-dom'
import { useTable }               from '@/contexts/TableContext'
import CartMiniWidget             from '@/components/CartMiniWidget'

export default function CustomerLayout() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const { tableId, setTableId } = useTable()

  useEffect(() => {
    if (tableNumber && tableNumber !== tableId) {
      setTableId(tableNumber)
    }
  }, [tableNumber, tableId, setTableId])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      <header className="p-4 bg-white shadow sticky top-0 z-10">
        <h1 className="text-xl font-bold">IBIZ에 오신 걸 환영합니다!</h1>
        <p className="text-sm">여기는 테이블 {tableNumber} 번입니다.</p>
        <nav className="mt-2 space-x-4 text-blue-600">
          <a href={`#/customer/${tableNumber}/welcome`}>메뉴 보기</a>
          <a href={`#/customer/${tableNumber}/orders`}>주문 현황</a>
          <a href={`#/customer/${tableNumber}/summary`}>테이블 요약</a>
          <a href={`#/customer/${tableNumber}/request`}>직원 부르기</a>
        </nav>
      </header>

      <main className="pt-4">
        <Outlet />
      </main>

      {/* 카트 미니 위젯 */}
      <CartMiniWidget />
    </div>
  )
}

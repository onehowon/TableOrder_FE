// src/pages/customer/CustomerLayout.tsx
import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useTable } from '@/contexts/TableContext'
import CartMiniWidget from '@/components/CartMiniWidget'

export default function CustomerLayout() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const { tableId, setTableId } = useTable()

  // URL 에 있는 번호로 context 세팅
  useEffect(() => {
    if (tableNumber && tableNumber !== tableId) {
      setTableId(tableNumber)
    }
  }, [tableNumber, tableId, setTableId])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      <header className="p-4 bg-white shadow sticky top-0 z-10">
        <h1 className="text-xl font-bold">테이블 {tableNumber} 주문</h1>
      </header>

      <main className="pt-4">
        <Outlet />
        {/* 장바구니 미니 위젯 항상 노출 */}
        <CartMiniWidget />
      </main>
    </div>
  )
}

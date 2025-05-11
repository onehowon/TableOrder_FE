// src/pages/customer/CustomerLayout.tsx
import { Outlet, useParams } from 'react-router-dom'
import { useTable } from '@/contexts/TableContext'
import React from 'react'

export default function CustomerLayout() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const { tableId, setTableId } = useTable()

  // URL 파라미터로 tableNumber 를 context 에 저장
  React.useEffect(() => {
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
      </main>
    </div>
  )
}

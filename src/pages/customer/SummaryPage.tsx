// src/pages/customer/SummaryPage.tsx
import { useParams } from 'react-router-dom'
import { fetchCustomerTableSummary } from '@/api/customer'
import { useEffect, useState } from 'react'

export default function SummaryPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const [summary, setSummary] = useState<{
    totalOrders: number
    totalSpent: number
    lastOrderAt: string
  } | null>(null)

  useEffect(() => {
    if (!tableNumber) return
    fetchCustomerTableSummary(Number(tableNumber))
      .then(res => setSummary(res.data.data))
      .catch(console.error)
  }, [tableNumber])

  if (!summary) return <p className="p-4">로딩 중…</p>

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">테이블 {tableNumber} 요약</h1>
      <p>주문 건수: {summary.totalOrders}</p>
      <p>총 결제액: {summary.totalSpent.toLocaleString()}원</p>
      <p>마지막 주문: {new Date(summary.lastOrderAt).toLocaleTimeString()}</p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '../api'

interface ItemSummary {
  name: string
  quantity: number
  totalPrice: number
}

interface TableSummary {
  tableNumber: number
  totalOrders: number
  totalAmount: number
  items: ItemSummary[]
}

export default function TableAdminSummaryPage() {
  const [summaries, setSummaries] = useState<TableSummary[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    api
      .get<{ data: TableSummary[] }>('/admin/tables/summary-all')
      .then(res => setSummaries(res.data.data))
      .catch(() => setError('테이블 요약을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center">로딩 중…</p>
  if (error)   return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">전체 테이블 요약</h2>
      {summaries.map(tbl => (
        <div key={tbl.tableNumber} className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-xl font-semibold mb-2">
            테이블 {tbl.tableNumber} — 주문 {tbl.totalOrders}건, 금액 {tbl.totalAmount.toLocaleString()}원
          </h3>
          <ul className="text-sm">
            {tbl.items.map(item => (
              <li key={item.name} className="flex justify-between">
                <span>{item.name} ({item.totalPrice.toLocaleString()}원)</span>
                <span>× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

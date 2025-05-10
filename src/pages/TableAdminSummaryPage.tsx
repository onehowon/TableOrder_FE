// src/pages/TableAdminSummaryPage.tsx
import { useEffect, useState } from 'react'
import { getAdminTableSummary } from '../api'

interface Item {
  menuName: string
  quantity: number
}

interface Summary {
  tableNumber: number
  totalAmount: number
  items: Item[]
}

export default function TableAdminSummaryPage() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]       = useState<string|null>(null)

  useEffect(() => {
    getAdminTableSummary(0)  // all-summary API 가 있다면 그것을 호출하세요.
      .then(r => setSummaries(r.data.data))
      .catch(() => setError('테이블 요약을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center">로딩 중…</p>
  if (error)   return <p className="text-center text-red-400">{error}</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">테이블별 요약</h2>
      <ul className="space-y-4">
        {summaries.map(s => (
          <li key={s.tableNumber} className="bg-zinc-800 p-4 rounded">
            <p className="font-semibold">테이블 {s.tableNumber}</p>
            <p>총 금액: {s.totalAmount.toLocaleString()}원</p>
            <ul className="mt-2">
              {s.items.map((it, i) => (
                <li key={i}>{it.menuName} × {it.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

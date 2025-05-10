// src/pages/TableAdminSummaryPage.tsx
import { useEffect, useState } from 'react'
import { getAllAdminTableSummaries } from '../api'
import type { TableSummaryDTO } from '../types'

export default function TableAdminSummaryPage() {
  const [summaries, setSummaries] = useState<TableSummaryDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getAllAdminTableSummaries()
      .then(res => setSummaries(res.data.data))
      .catch(() => setError('테이블 요약을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center">로딩중…</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        테이블별 요약
      </h2>

      <ul className="space-y-6">
        {summaries.map((summary: TableSummaryDTO, idx: number) => (
          <li
            key={idx}
            className="border border-zinc-700 rounded-xl p-4"
          >
            <h3 className="font-semibold mb-2">
              테이블 {summary.tableNumber}
            </h3>
            <p className="mb-2">
              총 금액:{' '}
              <span className="text-blue-400 font-semibold">
                {summary.totalAmount.toLocaleString()}원
              </span>
            </p>
            <ul className="list-disc list-inside">
              {Array.isArray(summary.items)
                ? summary.items.map(
                    (it: { menuName: string; quantity: number }, idx2: number) => (
                      <li key={idx2}>
                        {it.menuName} × {it.quantity}
                      </li>
                    )
                  )
                : null}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

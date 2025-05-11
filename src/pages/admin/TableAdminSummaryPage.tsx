// src/pages/admin/TableAdminSummaryPage.tsx
import { useEffect, useState } from 'react'
import {
  getAllTablesSummary,
  resetTable,
  TableSummaryResponse
} from '@/api'

export default function TableAdminSummaryPage() {
  const [summaries, setSummaries] = useState<TableSummaryResponse[]>([])
  const [loading, setLoading]     = useState(false)

  const fetchSummaries = async () => {
    setLoading(true)
    try {
      const res = await getAllTablesSummary()
      setSummaries(res.data.data)
    } catch (e) {
      console.error('전체 테이블 요약 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (tableNumber: number) => {
    if (!window.confirm(`테이블 ${tableNumber} 정산 완료 후 초기화하시겠습니까?`)) return
    try {
      await resetTable(tableNumber)
      alert(`테이블 ${tableNumber}이(가) 초기화되었습니다.`)
      fetchSummaries()
    } catch (e) {
      console.error('테이블 초기화 실패', e)
      alert('초기화 중 에러가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [])

  if (loading) {
    return <p className="p-6">로딩 중…</p>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-4">
      <h2 className="text-2xl font-bold mb-4">테이블 번호</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map(s => (
          <div
            key={s.tableNumber}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <div className="text-lg font-medium">테이블 {s.tableNumber}</div>
              <div className="text-gray-600">주문수 {s.totalOrders}건</div>
              <div className="text-gray-800">금액 {s.totalSpent.toLocaleString()}원</div>
            </div>
            <button
              onClick={() => handleReset(s.tableNumber)}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              정산 완료
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

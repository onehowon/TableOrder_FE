// src/pages/admin/TableAdminSummaryPage.tsx
import { useEffect, useState } from 'react'
import {
  getAllTablesSummary,
  resetTable,
  TableSummaryResponse
} from '@/api'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function TableAdminSummaryPage() {
  const [summaries, setSummaries] = useState<TableSummaryResponse[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const fetchSummaries = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllTablesSummary()
      setSummaries(res.data.data)
    } catch (e) {
      console.error(e)
      setError('전체 테이블 요약 조회 실패')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (tableNumber: number) => {
    if (!window.confirm(`테이블 ${tableNumber} 정산 완료 후 초기화하시겠습니까?`)) {
      return
    }
    try {
      await resetTable(tableNumber)
      alert(`테이블 ${tableNumber}이(가) 초기화되었습니다.`)
      fetchSummaries()
    } catch (e) {
      console.error(e)
      alert('초기화 중 에러가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [])

  if (loading) {
    return <p className="p-6">로딩 중…</p>
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 font-bold mb-2">문제가 발생했습니다</div>
        <div className="text-gray-700">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">테이블 번호</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map(s => {
          // totalSpent 가 undefined 인 경우 0으로 기본 처리
          const total = s.totalSpent ?? 0
          return (
            <div
              key={s.tableNumber}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <div className="text-lg font-medium">테이블 {s.tableNumber}</div>
                <div className="text-gray-600">주문수 {s.totalOrders}건</div>
                <div className="text-gray-800">
                  금액 {total.toLocaleString()}원
                </div>
              </div>
              <button
                onClick={() => handleReset(s.tableNumber)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                정산 완료
              </button>
            </div>
          )
        })}
        {summaries.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            오늘 들어온 주문이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}

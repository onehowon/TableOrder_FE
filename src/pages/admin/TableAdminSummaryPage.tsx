import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import {
  getTableSummary,
  resetTable,
  TableSummaryResponse
} from '@/api'

export default function TableAdminSummaryPage() {
  const { tableNumber: tn } = useParams<{ tableNumber: string }>()
  const tableNumber = Number(tn)
  
  const [summary, setSummary] = useState<TableSummaryResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const res = await getTableSummary(tableNumber)
      setSummary(res.data.data)
    } catch (e) {
      console.error('테이블 요약 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('정산 완료 처리하면 이 테이블의 오늘 주문이 모두 초기화됩니다.\n진행하시겠습니까?')) {
      return
    }
    try {
      await resetTable(tableNumber)
      alert('정산 완료! 테이블이 초기화되었습니다.')
      fetchSummary()
    } catch (e) {
      console.error('정산 실패', e)
      alert('정산 중 에러가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [tableNumber])

  if (loading || !summary) {
    return <p className="p-6">로딩 중…</p>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-4">
      <h2 className="text-2xl font-bold">테이블 번호</h2>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="text-lg">테이블 {summary.tableNumber}</div>
        <div className="text-gray-600">주문수 {summary.totalOrders}건</div>
        <div className="text-gray-800 font-medium">
          금액 {summary.totalSpent.toLocaleString()}원
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          정산 완료
        </button>
      </div>
    </div>
  )
}

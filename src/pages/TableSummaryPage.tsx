// src/pages/TableSummaryPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

interface ItemSummary {
  name: string
  quantity: number
  totalPrice: number
}

interface SummaryResponse {
  tableNumber: number
  totalOrders: number
  totalAmount: number
  items: ItemSummary[]
}

export default function TableSummaryPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tableId) {
      setError('테이블 번호가 없습니다.')
      setLoading(false)
      return
    }
    const fetchSummary = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/customer/tables/${tableId}/summary`)
        setSummary(res.data.data)
      } catch {
        setError('테이블 요약을 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [tableId])

  if (loading) {
    return <p className="text-center py-20 text-gray-400">로딩 중…</p>
  }
  if (error) {
    return <p className="text-center py-20 text-red-500">{error}</p>
  }
  if (!summary) {
    return null
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">테이블 {summary.tableNumber} 요약</h2>
      <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
        <p>총 주문 건수: {summary.totalOrders}회</p>
        <p>
          총 금액:{' '}
          <span className="font-semibold text-blue-400">
            {summary.totalAmount.toLocaleString()}원
          </span>
        </p>
        <h3 className="font-semibold">메뉴별 합계</h3>
        <ul className="space-y-2">
          {summary.items.map(item => (
            <li key={item.name} className="flex justify-between">
              <span>{item.name}</span>
              <span>× {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

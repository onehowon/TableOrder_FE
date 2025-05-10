import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import api                     from '../api'
import PageWrapper             from '../components/PageWrapper'

interface ItemSummary {
  name: string
  quantity: number
  totalPrice: number
}

interface TableSummaryResponse {
  tableNumber: number
  totalOrders: number
  totalAmount: number
  items: ItemSummary[]
}

export default function TableSummaryPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const [summary, setSummary] = useState<TableSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      if (!tableId) {
        setError('테이블 정보가 없습니다.')
        setLoading(false)
        return
      }
      try {
        const res = await api.get(`/customer/tables/${tableId}/summary`)
        setSummary(res.data.data)
      } catch {
        setError('요약 정보를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [tableId])

  if (loading) return <PageWrapper title="테이블 요약"><p>로딩 중…</p></PageWrapper>
  if (error)   return <PageWrapper title="테이블 요약"><p className="text-red-500">{error}</p></PageWrapper>
  if (!summary) return null

  return (
    <PageWrapper title={`테이블 ${summary.tableNumber} 요약`}>
      <p>총 주문 건수: {summary.totalOrders}회</p>
      <p>
        총 금액: <b>{summary.totalAmount.toLocaleString()}원</b>
      </p>
      <h3 className="mt-4 font-semibold">메뉴별 합계</h3>
      <ul className="list-disc pl-5">
        {summary.items.map(it => (
          <li key={it.name}>
            {it.name} × {it.quantity}개 ({it.totalPrice.toLocaleString()}원)
          </li>
        ))}
      </ul>
    </PageWrapper>
  )
}

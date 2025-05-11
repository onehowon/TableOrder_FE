// src/pages/admin/TableAdminSummaryPage.tsx
import { useEffect, useState } from 'react'
import type { TableSummaryResponse } from '@/api'
import { getAllTablesSummary } from '@/api'

export default function TableAdminSummaryPage() {
  const [tables, setTables]   = useState<TableSummaryResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getAllTablesSummary()

        // ─── ① 원본 응답 객체 확인
        console.log('▶ raw response:', res)

        // ─── ② res.data 객체 확인
        console.log('▶ res.data:', res.data)

        // ─── ③ 실제 데이터 배열 확인
        console.log('▶ res.data.data:', res.data.data)

        setTables(res.data?.data ?? [])
      } catch (err) {
        console.error('테이블 요약 조회 실패', err)
      } finally {
        setLoading(false)
      }
    }

    load()
    // 주기적 갱신이 필요하면 주석 해제
    // const iv = setInterval(load, 10000)
    // return () => clearInterval(iv)
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">테이블 번호</h2>
      {loading ? (
        <p>로딩 중…</p>
      ) : (
        <ul className="space-y-2">
          {tables.map((t) => (
            <li
              key={t.tableNumber}
              className="p-4 bg-white rounded shadow flex justify-between"
            >
              <span>테이블 {t.tableNumber}</span>
              <span>주문수 {t.totalOrders.toLocaleString()}건</span>
              <span>금액 {t.totalSpent.toLocaleString()}원</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

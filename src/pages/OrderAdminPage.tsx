// src/pages/OrderAdminPage.tsx
import { useEffect, useState } from 'react'
import api from '../api'

interface OrderRow {
  tableNumber: string
  itemsSummary: string
  status: string
}

const statusColors: Record<string, string> = {
  'WAITING':    'bg-gray-100 text-gray-700',
  'COOKING':    'bg-purple-100 text-purple-700',
  'COMPLETED':  'bg-green-100 text-green-700',
  'CANCELLED':  'bg-red-100    text-red-700',
  // 필요에 따라 다른 상태 추가
}

export default function OrderAdminPage() {
  const [rows, setRows] = useState<OrderRow[]>([])

  useEffect(() => {
    api.get<{ data: OrderRow[] }>('/admin/orders')
      .then(res => setRows(res.data.data))
      .catch(err => {
        console.error('주문 목록 로딩 실패', err)
      })
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">주문 리스트</h2>
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-4 text-left">테이블 번호</th>
              <th className="px-6 py-4 text-left">menu & 수량</th>
              <th className="px-6 py-4 text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.tableNumber} className="border-b last:border-0">
                <td className="px-6 py-4">
                  {/** 숫자일 경우 toString() 후 padStart */}
                  {r.tableNumber.toString().padStart(5, '0')}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {r.itemsSummary || '-'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusColors[r.status] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

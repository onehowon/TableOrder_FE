import { useEffect, useState } from 'react'
import api from '../api'

interface OrderRow {
  tableNumber: string
  itemsSummary: string
  status: '제조완료' | '제조중' | '주문내역×'
}

const statusColors: Record<OrderRow['status'], string> = {
  '제조완료': 'bg-green-100 text-green-700',
  '제조중':   'bg-purple-100 text-purple-700',
  '주문내역×': 'bg-red-100 text-red-700',
}

export default function OrderAdminPage() {
  const [rows, setRows] = useState<OrderRow[]>([])

  useEffect(() => {
    api.get<{ data: OrderRow[] }>('/admin/orders')
      .then(r => setRows(r.data.data))
      .catch(console.error)
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
                  {r.tableNumber.toString().padStart(5, '0')}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {r.itemsSummary || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[r.status]}`}>
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

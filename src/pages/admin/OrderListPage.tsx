import { useEffect, useState } from 'react'
import {
  listOrders,
  updateOrderStatus,
  OrderDetailDTO,
  StatusUpdateReq,
} from '@/api'

// 백엔드 enum 그대로 사용
const STATUS_LABEL: Record<OrderDetailDTO['status'], { text: string; bg: string; textColor: string }> = {
  WAITING: { text: '주문 접수', bg: 'bg-red-100', textColor: 'text-red-800' },
  COOKING: { text: '제조 중',   bg: 'bg-purple-100', textColor: 'text-purple-800' },
  SERVED:  { text: '제조 완료', bg: 'bg-green-100', textColor: 'text-green-800' },
}

// WAITING 제외
type NextStatus = Exclude<OrderDetailDTO['status'], 'WAITING'>  // → 'COOKING' | 'SERVED'

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderDetailDTO[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await listOrders()
      setOrders(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const onChangeStatus = async (orderId: number, newStatus: NextStatus) => {
    // WAITING 은 보낼 수 없으므로 NextStatus 로 제한되어 이미 걸러짐
    const body: StatusUpdateReq = { status: newStatus }
    await updateOrderStatus(orderId, body)
    fetchOrders()
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">주문 리스트</h2>
      {loading
        ? <p>로딩 중…</p>
        : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">테이블 번호</th>
                  <th className="px-6 py-3">메뉴 & 수량</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const label = STATUS_LABEL[o.status]
                  const menuText = o.items.length
                    ? o.items.map(i => `${i.menuName} ${i.quantity}개`).join(', ')
                    : '-'
                  return (
                    <tr key={o.orderId} className="border-b last:border-none hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{o.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {String(o.tableNumber).padStart(5, '0')}
                      </td>
                      <td className="px-6 py-4">{menuText}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${label.bg} ${label.textColor}`}>
                          {label.text}
                        </span>
                        <select
                          value={o.status}
                          onChange={e => onChangeStatus(o.orderId, e.target.value as NextStatus)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          {/* WAITING 은 API에 보낼 수 없으니 제외 */}
                          <option value="COOKING">제조 중</option>
                          <option value="SERVED">제조 완료</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}

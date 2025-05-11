// src/pages/admin/OrderAdminPage.tsx
import { useEffect, useState } from 'react'
import type { OrderDetailDTO, StatusUpdateReq } from '@/api'
import {
  listOrders,
  updateOrderStatus,
} from '@/api'

export default function OrderAdminPage() {
  const [orders, setOrders]   = useState<OrderDetailDTO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await listOrders()
        setOrders(res.data?.data ?? [])
      } catch (err) {
        console.error('주문 리스트 조회 실패', err)
      } finally {
        setLoading(false)
      }
    }
    load()
    // // 주기적 갱신이 필요하면 주석 해제
    // const iv = setInterval(load, 5000)
    // return () => clearInterval(iv)
  }, [])

  const changeStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, { status } as StatusUpdateReq)
      // 변경 후 재조회
      const res = await listOrders()
      setOrders(res.data?.data ?? [])
    } catch (err) {
      console.error('상태 변경 실패', err)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">주문 리스트</h2>
      {loading ? (
        <p>로딩 중…</p>
      ) : (
        <table className="w-full bg-white rounded overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Table</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderId} className="border-t">
                <td className="p-3">{o.orderId}</td>
                <td className="p-3">{o.tableNumber}</td>
                <td className="p-3">
                  {o.items.map(x => `${x.menuName}(${x.quantity})`).join(', ')}
                </td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => changeStatus(o.orderId, 'PREPARING')}
                  >
                    준비중
                  </button>
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => changeStatus(o.orderId, 'DONE')}
                  >
                    완료
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { listOrdersAdmin, updateOrderStatus } from '@/api'
import type { OrderDetailDTO } from '@/api'

export default function OrderBoardPage() {
  const [orders, setOrders] = useState<OrderDetailDTO[]>([])
  const [page, setPage]     = useState(0)
  const pageSize = 6

  const fetch = async () => {
    const res = await listOrdersAdmin()
    setOrders(res.data.data.filter(o => o.status !== 'DELETED'))
  }

  useEffect(() => {
    fetch()
    const iv = setInterval(fetch, 5000)
    return () => clearInterval(iv)
  }, [])

  const pageOrders = orders.slice(page * pageSize, (page + 1) * pageSize)

  const changeStatus = async (orderId: number, status: 'SERVED' | 'DELETED') => {
    await updateOrderStatus(orderId, { status })
    fetch()
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {pageOrders.map(o => (
        <div key={o.orderId} className="border p-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <span>{o.tableNumber}번 테이블</span>
            <span>{new Date(o.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="space-y-1">
            {o.items.map(i => (
              <div key={i.name} className="flex justify-between">
                <span>{i.name}</span>
                <span>{i.quantity}개</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="col-span-2 flex justify-between mt-4">
        <button onClick={() => setPage(p => Math.max(p-1,0))} disabled={page===0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">← 이전 페이지</button>
        <button onClick={() => setPage(p => p+1)} disabled={(page+1)*pageSize >= orders.length}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">다음 페이지 →</button>
      </div>
      <div className="col-span-2 mt-4 flex space-x-4">
        <button onClick={() => changeStatus(pageOrders[0]?.orderId, 'SERVED')}
          className="flex-1 py-2 bg-green-500 text-white rounded">완료</button>
        <button onClick={() => changeStatus(pageOrders[0]?.orderId, 'DELETED')}
          className="flex-1 py-2 bg-red-400 text-white rounded">삭제</button>
      </div>
    </div>
  )
}

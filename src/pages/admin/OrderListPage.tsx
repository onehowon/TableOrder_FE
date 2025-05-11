import { useEffect, useState } from 'react'
import {
  listOrders,
  updateOrderStatus,
  OrderDetailDTO,
  StatusUpdateReq,
} from '@/api'

// 화면 표시용 레이블 매핑 (WAITING도 표기는 하지만, 변경 옵션엔 빠집니다)
const STATUS_LABEL: Record<OrderDetailDTO['status'], { text: string; bg: string; textColor: string }> = {
  WAITING:   { text: '주문 접수', bg: 'bg-red-100',     textColor: 'text-red-800'   },
  COOKING:   { text: '제조 중',   bg: 'bg-purple-100',  textColor: 'text-purple-800'},
  SERVED:    { text: '제조 완료', bg: 'bg-green-100',   textColor: 'text-green-800' },
}

// WAITING을 뺀, 실제로 API에 보낼 수 있는 다음 상태 타입
type NextStatus = Exclude<OrderDetailDTO['status'], 'WAITING'>  // → 'COOKING' | 'SERVED'

export default function OrderListPage() {
  const [orders, setOrders]   = useState<OrderDetailDTO[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await listOrders()
      setOrders(res.data.data)
    } catch (e) {
      console.error('주문 리스트 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const iv = setInterval(fetchOrders, 5000)
    return () => clearInterval(iv)
  }, [])

  const onChangeStatus = async (orderId: number, newStatus: NextStatus) => {
    // 요청 페이로드를 DTO 형태로 준비
    const body: StatusUpdateReq = { status: newStatus }
    // COOKING(제조 중)일 때만 ETA 입력받아서 추가
    if (newStatus === 'COOKING') {
      const minutes = window.prompt('예상 소요 시간을 분 단위로 입력하세요', '10')
      body.estimatedTime = minutes ? Number(minutes) : undefined
    }

    try {
      await updateOrderStatus(orderId, body)
      await fetchOrders()  // 업데이트 후 리스트 리프레시
    } catch (e) {
      console.error('상태 변경 실패', e)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">주문 리스트</h2>
      {loading ? (
        <p>로딩 중…</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">테이블 번호</th>
                <th className="px-6 py-3">메뉴 &amp; 수량</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const label    = STATUS_LABEL[o.status]
                const menuText = o.items.length
                  ? o.items.map(i => `${i.name} ${i.quantity}개`).join(', ')
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
                        onChange={e => onChangeStatus(
                          o.orderId,
                          e.target.value as NextStatus
                        )}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {/* WAITING은 API 호출하지 않으므로 옵션에서 뺍니다 */}
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
      )}
    </div>
  )
}

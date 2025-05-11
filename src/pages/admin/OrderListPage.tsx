// src/pages/admin/OrderListPage.tsx
import { useEffect, useState } from 'react'
import {
  listOrders,
  updateOrderStatus,
  OrderDetailDTO,
} from '@/api'

// 백엔드 enum 그대로 사용
type Status = OrderDetailDTO['status']

const STATUS_LABEL: Record<Status, { text: string; bg: string; textColor: string }> = {
  WAITING:   { text: '주문 접수', bg: 'bg-red-100',    textColor: 'text-red-800'   },
  COOKING:   { text: '제조 중',   bg: 'bg-purple-100', textColor: 'text-purple-800'},
  SERVED:    { text: '제조 완료', bg: 'bg-green-100',  textColor: 'text-green-800' },
}

type NextStatus = Exclude<Status, 'WAITING'>  // → 'COOKING' | 'SERVED'

export default function OrderListPage() {
  const [orders, setOrders]     = useState<OrderDetailDTO[]>([])
  const [loading, setLoading]   = useState(false)
  // 행별로 ETA 편집 중인지, 그리고 그 값을 저장
  const [etaEdits, setEtaEdits] = useState<Record<number,string>>({})

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

  // 드롭다운 변경 핸들러
  const handleStatusSelect = (orderId: number, newStatus: NextStatus) => {
    if (newStatus === 'COOKING') {
      // 직접 API 호출하지 말고, 인라인 input 띄우기
      setEtaEdits(prev => ({ ...prev, [orderId]: '' }))
    } else {
      // 바로 '제조 완료' API 호출
      onChangeStatus(orderId, newStatus, undefined)
    }
  }

  // 확인 버튼 눌렀을 때—API 호출
  const onChangeStatus = async (
    orderId: number,
    status: NextStatus,
    estimatedTime?: number
  ) => {
    try {
      await updateOrderStatus(orderId, { status, estimatedTime })
      fetchOrders()
    } catch (e) {
      console.error('상태 변경 실패', e)
    } finally {
      // 편집 UI 초기화
      setEtaEdits(prev => {
        const copy = { ...prev }
        delete copy[orderId]
        return copy
      })
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
                <th className="px-6 py-3">메뉴 & 수량</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const label    = STATUS_LABEL[o.status]
                const menuText = o.items.length
                  ? o.items.map(i => `${i.name} ${i.quantity}개`).join(', ')
                  : '-'
                const isEditingEta = o.orderId in etaEdits

                return (
                  <tr key={o.orderId} className="border-b last:border-none hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{o.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {String(o.tableNumber).padStart(5, '0')}
                    </td>
                    <td className="px-6 py-4">{menuText}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${label.bg} ${label.textColor}`}>
                          {label.text}
                        </span>

                        {isEditingEta ? (
                          <>
                            <input
                              type="number"
                              min="1"
                              value={etaEdits[o.orderId]}
                              onChange={e =>
                                setEtaEdits(prev => ({
                                  ...prev,
                                  [o.orderId]: e.target.value
                                }))
                              }
                              placeholder="예상시간(분)"
                              className="w-20 border rounded px-2 py-1 text-sm"
                            />
                            <button
                              onClick={() =>
                                onChangeStatus(
                                  o.orderId,
                                  'COOKING',
                                  Number(etaEdits[o.orderId]) || 0
                                )
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                              확인
                            </button>
                            <button
                              onClick={() =>
                                setEtaEdits(prev => {
                                  const c = { ...prev }
                                  delete c[o.orderId]
                                  return c
                                })
                              }
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <select
                            value={o.status === 'WAITING' ? '' : o.status}
                            onChange={e =>
                              handleStatusSelect(
                                o.orderId,
                                e.target.value as NextStatus
                              )
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="" disabled>변경</option>
                            <option value="COOKING">제조 중</option>
                            <option value="SERVED">제조 완료</option>
                          </select>
                        )}
                      </div>
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

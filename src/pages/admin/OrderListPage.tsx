// src/pages/admin/OrderListPage.tsx
import { useEffect, useState } from 'react'
import { listOrdersAdmin, updateOrderStatus } from '@/api'
import type { OrderDetailDTO } from '@/api'

type Status = OrderDetailDTO['status']

// 테이블에 뿌려줄 상태 라벨 & 배경색 설정
const LABEL: Record<Status, { text: string; bg: string }> = {
  WAITING: { text: '준비 중',    bg: 'bg-yellow-100' },
  SERVED:  { text: '제조 완료',  bg: 'bg-green-100'  },
  DELETED: { text: '삭제 완료',  bg: 'bg-gray-200'   },
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderDetailDTO[]>([])

  // 서버에서 주문 리스트를 가져옵니다
  const fetch = async () => {
    try {
      const res = await listOrdersAdmin()
      setOrders(res.data.data)
    } catch (err) {
      console.error('주문 리스트 조회 실패', err)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  // 버튼 클릭 시 해당 주문의 상태를 변경하고 재조회
  const onStatus = (orderId: number, status: Status) => {
    updateOrderStatus(orderId, { status })
      .then(fetch)
      .catch(err => {
        console.error('상태 변경 실패', err)
        alert('상태 변경 중 오류가 발생했습니다.')
      })
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">주문 리스트</h2>

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">시간</th>
              <th className="px-6 py-3">테이블 번호</th>
              <th className="px-6 py-3">메뉴 & 수량</th>
              <th className="px-6 py-3">상태</th>
              <th className="px-6 py-3">삭제 시각</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const lbl = LABEL[o.status]
              const menuText = o.items
                .map(i => `${i.name} ${i.quantity}개`)
                .join(', ')

              return (
                <tr
                  key={o.orderId}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  {/* 주문 생성 시각 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  {/* 테이블 번호 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {o.tableNumber}
                  </td>
                  {/* 메뉴 & 수량 */}
                  <td className="px-6 py-4">{menuText || '-'}</td>
                  {/* 상태 레이블 + 액션 버튼 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`${lbl.bg} px-2 py-1 rounded-full text-sm font-medium`}
                    >
                      {lbl.text}
                    </span>
                    <div className="mt-2">
                      {o.status === 'WAITING' && (
                        <button
                          onClick={() => onStatus(o.orderId, 'SERVED')}
                          className="text-xs px-2 py-1 bg-green-200 rounded hover:bg-green-300 transition"
                        >
                          제조 완료
                        </button>
                      )}
                      {o.status === 'SERVED' && (
                        <button
                          onClick={() => onStatus(o.orderId, 'DELETED')}
                          className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300 transition"
                        >
                          삭제
                        </button>
                      )}
                      {o.status === 'DELETED' && (
                        <button
                          onClick={() => onStatus(o.orderId, 'WAITING')}
                          className="text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 transition"
                        >
                          복원
                        </button>
                      )}
                    </div>
                  </td>
                  {/* 삭제 시각 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {o.deletedAt
                      ? new Date(o.deletedAt).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

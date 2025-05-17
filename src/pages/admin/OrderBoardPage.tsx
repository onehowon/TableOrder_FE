// src/pages/admin/OrderBoardPage.tsx
import { useEffect, useState } from 'react'
import { listOrdersAdmin, updateOrderStatus } from '@/api'
import type { OrderDetailDTO } from '@/api'

const PAGE_SIZE = 6

export default function OrderBoardPage() {
  const [orders, setOrders] = useState<OrderDetailDTO[]>([])
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  // 1) 삭제된(체크된) 아이템 관리: { [orderId]: Set<itemName> }
  const [removedItems, setRemovedItems] = useState<Record<number, Set<string>>>({})

  const fetch = async () => {
    const res = await listOrdersAdmin()
    setOrders(res.data.data.filter(o => o.status !== 'DELETED'))
  }
  useEffect(() => {
    fetch()
    const iv = setInterval(fetch, 5000)
    return () => clearInterval(iv)
  }, [])

  const pageOrders = orders.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleAction = async (newStatus: 'SERVED' | 'DELETED') => {
    if (selected == null) return
    await updateOrderStatus(selected, { status: newStatus })
    setSelected(null)
    fetch()
  }

  // ── 토글 함수: 아이템 클릭하면 removedItems[orderId]에 추가/제거 ──
  const toggleItem = (orderId: number, itemName: string) => {
    setRemovedItems(prev => {
      const copy = { ...prev }
      const setForOrder = new Set(copy[orderId] || [])
      if (setForOrder.has(itemName)) setForOrder.delete(itemName)
      else setForOrder.add(itemName)
      copy[orderId] = setForOrder
      return copy
    })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6">주문 현황</h2>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-2 gap-6">
        {pageOrders.map(o => {
          const isSel = o.orderId === selected
          const removedSet = removedItems[o.orderId] || new Set<string>()
          return (
            <div
              key={o.orderId}
              onClick={() => setSelected(isSel ? null : o.orderId)}
              className={[
                'bg-white pt-12 px-6 pb-6 rounded-xl shadow-lg cursor-pointer relative transition-all',
                isSel ? 'border-2 border-blue-500' : 'border border-gray-200'
              ].join(' ')}
            >
              {/* 주문번호, 테이블 번호, 타임스탬프, 상태 배지 생략 */}

              {/* ── 메뉴 리스트 ── */}
              <div className="mb-6 space-y-2">
                {o.items.map(i => {
                  // 이미 지운(체크된) 메뉴면 렌더링하지 않음
                  if (removedSet.has(i.name)) return null

                  return (
                    <div
                      key={i.name}
                      // 클릭하면 toggleItem 호출
                      onClick={e => {
                        e.stopPropagation()
                        toggleItem(o.orderId, i.name)
                      }}
                      className="flex justify-between items-center whitespace-nowrap text-lg text-gray-700 hover:bg-gray-100 rounded px-2 py-1"
                    >
                      <span>{i.name}</span>
                      <span>{i.quantity}개</span>
                    </div>
                  )
                })}
              </div>

              {/* 하단 페이징·버튼 생략 */}
            </div>
          )
        })}
      </div>

      {/* 페이징 & 완료/삭제 버튼 부분 */}
      <div className="mt-6 flex items-center justify-between">
        {/* ... */}
      </div>
    </div>
  )
}

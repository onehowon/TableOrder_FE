// src/pages/admin/OrderBoardPage.tsx
import { useEffect, useState, ChangeEvent, useRef } from 'react'
import { listOrdersAdmin, updateOrderStatus } from '@/api'
import type { OrderDetailDTO } from '@/api'

const PAGE_SIZE = 6
const NEW_ORDER_SOUND = '/sounds/baedalyi-minjog.mp3'

// ─────────── OrderCard 컴포넌트 ───────────
interface OrderCardProps {
  order: OrderDetailDTO
  selected: number | null
  onSelect: (orderId: number | null) => void
}

function OrderCard({ order: o, selected, onSelect }: OrderCardProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const isSel = o.orderId === selected

  const toggleItem = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setCheckedItems(prev => {
      const next = new Set(prev)
      prev.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  return (
    <div
      onClick={() => onSelect(isSel ? null : o.orderId)}
      className={[
        'bg-white pt-12 px-6 pb-6 rounded-xl shadow-lg cursor-pointer relative transition-all',
        isSel ? 'border-2 border-blue-500' : 'border border-gray-200'
      ].join(' ')}
    >
      {/* 주문번호 */}
      <div className="absolute top-2 left-4 text-base text-red-600 font-bold">
        주문번호 {String(o.orderId).padStart(3, '0')}
      </div>
      {/* 테이블 */}
      <div className="text-xl font-semibold mb-4">
        {o.tableNumber}번 테이블
      </div>

      {/* 메뉴 리스트 */}
      <div className="mb-6 space-y-2">
        {o.items.map((i, idx) => {
          const done = checkedItems.has(idx)
          return (
            <div
              key={i.name + idx}
              className="flex justify-between items-start text-lg text-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <label className="flex items-start flex-1 space-x-2">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={e => toggleItem(idx, e)}
                  className="mr-2 mt-1"
                />
                <span
                  className={`break-words ${done ? 'line-through text-gray-400' : ''}`}
                >
                  {i.name}
                </span>
              </label>
              <span className={`${done ? 'line-through text-gray-400' : ''} whitespace-nowrap`}>
                {i.quantity}개
              </span>
            </div>
          )
        })}
      </div>

      {/* 주문 시각 */}
      <div className="absolute top-4 right-4 text-base text-gray-500">
        {new Date(o.createdAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>

      {/* 상태 배지 */}
      <div className="text-lg">
        상태:{' '}
        <span
          className={`px-3 py-1 rounded-full text-white ${
            o.status === 'WAITING' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {o.status === 'WAITING' ? '준비 중' : '완료'}
        </span>
      </div>
    </div>
  )
}
// ───────────────────────────────────────────

export default function OrderBoardPage() {
  const [orders, setOrders] = useState<OrderDetailDTO[]>([])
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement>(new Audio(NEW_ORDER_SOUND))
  const prevOrderIdsRef = useRef<Set<number>>(new Set())

  const fetchAndNotify = async () => {
    const res = await listOrdersAdmin()
    const newList = res.data.data.filter(o => o.status !== 'DELETED')

    const prevIds = prevOrderIdsRef.current
    const newIds = new Set(newList.map(o => o.orderId))
    const hasNewOrder = [...newIds].some(id => !prevIds.has(id))
    if (hasNewOrder) {
      audioRef.current.play().catch(() => {})
    }

    setOrders(newList)
    prevOrderIdsRef.current = newIds
  }

  useEffect(() => {
    fetchAndNotify()
    const iv = setInterval(fetchAndNotify, 5000)
    return () => clearInterval(iv)
  }, [])

  const pageOrders = orders.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  )

  const handleAction = async (newStatus: 'SERVED' | 'DELETED') => {
    if (selected == null) return
    await updateOrderStatus(selected, { status: newStatus })
    setSelected(null)
    fetchAndNotify()
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6">주문 현황</h2>

      {/* 그리드 */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-2 gap-6">
        {pageOrders.map(o => (
          <OrderCard
            key={o.orderId}
            order={o}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* 페이지네이션 & 액션 버튼 */}
      <div className="mt-6 flex items-center justify-between">
        {/* 이전/다음 */}
        <div className="space-x-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ← 이전 페이지
          </button>
          <button
            onClick={() =>
              setPage(p =>
                (p + 1) * PAGE_SIZE < orders.length ? p + 1 : p
              )
            }
            disabled={(page + 1) * PAGE_SIZE >= orders.length}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            다음 페이지 →
          </button>
        </div>

        {/* 완료 / 삭제 */}
        <div className="space-x-4">
          <button
            onClick={() => handleAction('SERVED')}
            disabled={
              selected == null ||
              orders.find(o => o.orderId === selected)?.status !== 'WAITING'
            }
            className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            완료
          </button>
          <button
            onClick={() => handleAction('DELETED')}
            disabled={selected == null}
            className="px-6 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

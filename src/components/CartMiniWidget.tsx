// src/components/layout/CartMiniWidget.tsx
import { useCart }     from '@/contexts/CartContext'
import { useTable }    from '@/contexts/TableContext'
import { useNavigate } from 'react-router-dom'

export default function CartMiniWidget() {
  const { cart, addItem, decrement, remove } = useCart()
  const { tableId }    = useTable()
  const nav             = useNavigate()

  const cnt = cart.reduce((s, i) => s + i.quantity, 0)
  const sum = cart.reduce((s, i) => s + (i.price ?? 0) * (i.quantity ?? 0), 0)

  if (cnt === 0 || !tableId) return null

  return (
    <aside className="fixed bottom-4 right-4 w-72 max-w-[90vw]
                      bg-zinc-800/95 backdrop-blur p-4 rounded-xl z-50">
      <h4 className="mb-2 font-semibold text-white">장바구니</h4>

      <ul className="max-h-48 overflow-y-auto space-y-1 mb-3 text-sm text-white">
        {cart.map(i => (
          <li key={i.menuId} className="flex justify-between items-center">
            <span className="truncate">{i.name}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => decrement(i.menuId)} className="btn-xs">-</button>
              <span>{i.quantity}</span>
              <button
                onClick={() => addItem({ menuId: i.menuId, name: i.name, price: i.price })}
                className="btn-xs"
              >
                +
              </button>
              <button
                onClick={() => remove(i.menuId)}
                className="text-red-400 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-right mb-2 text-white">
        합계 <b>{sum > 0 ? sum.toLocaleString() + '원' : '-'}</b>
      </div>

      <button
        onClick={() => nav(`/customer/${tableId}/confirm`)}
        className="btn-primary w-full"
      >
        주문 확인 ({cnt}개)
      </button>
    </aside>
  )
}

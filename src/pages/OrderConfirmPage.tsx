// src/pages/OrderConfirmPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { createOrder } from '../api'
import { useTable } from '../contexts/TableContext'

interface CartItem {
  menuId: number
  name: string
  price: number
  quantity: number
}

export default function OrderConfirmPage() {
  const { tableId } = useTable()
  const { cart, clearCart } = useCart()       // ← items 대신 cart 로 받음
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tableId) {
      navigate('/welcome')
    }
  }, [tableId, navigate])

  const items: CartItem[] = cart             // ← cart 를 items 로 재할당
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const onSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await createOrder({
        tableNumber: Number(tableId),
        items: items.map(i => ({
          menuId: i.menuId,
          quantity: i.quantity
        }))
      })
      clearCart()
      navigate('/welcome')
    } catch {
      setError('주문 처리 중 오류가 발생했습니다.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p>장바구니가 비어 있습니다.</p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-4 btn-secondary w-32 mx-auto"
        >
          메뉴로
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">주문 확인</h2>

      <ul className="space-y-4 mb-6">
        {items.map((i: CartItem) => (
          <li
            key={i.menuId}
            className="flex justify-between bg-zinc-800 p-4 rounded-xl"
          >
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-gray-400">
                {i.quantity} × {i.price.toLocaleString()}원
              </p>
            </div>
            <p className="font-bold">
              {(i.quantity * i.price).toLocaleString()}원
            </p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold">총 합계</span>
        <span className="text-xl font-bold">
          {totalAmount.toLocaleString()}원
        </span>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="btn-primary w-full"
      >
        {submitting ? '주문 중…' : '주문 완료'}
      </button>
    </div>
  )
}

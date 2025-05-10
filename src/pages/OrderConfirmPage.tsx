// src/pages/OrderConfirmPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useTable } from '../contexts/TableContext'
import { createOrder } from '../api'

export default function OrderConfirmPage() {
  const { cart, clearCart } = useCart()
  const { tableId }         = useTable()
  const nav                  = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const handleOrder = async () => {
    if (!tableId) { setError('테이블 정보가 없습니다.'); return }
    if (cart.length === 0) { setError('장바구니가 비어 있습니다.'); return }
    setLoading(true); setError(null)

    try {
      const res = await createOrder({
        tableNumber: Number(tableId),
        items: cart.map(i => ({ menuId: i.menuId, quantity: i.quantity }))
      })
      const orderId = res.data.data.orderId
      if (!orderId) throw new Error('orderId 없음')
      clearCart()
      alert('주문이 정상 접수되었습니다!')
      setTimeout(() => nav(`/order/status/${orderId}`), 1500)
    } catch (e: any) {
      setError(e.response?.data?.message || '주문 실패. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-2 py-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">주문 확인</h2>
      {cart.length === 0
        ? <p className="text-center">장바구니가 비어 있습니다.</p>
        : cart.map(item => (
            <div key={item.menuId} className="flex justify-between mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))
      }
      <div className="font-bold text-right mb-4">합계: {total.toLocaleString()}원</div>
      <button
        onClick={handleOrder}
        disabled={loading || cart.length === 0}
        className="btn-primary"
      >
        {loading ? '주문 접수 중…' : '주문하기'}
      </button>
      {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
    </div>
  )
}
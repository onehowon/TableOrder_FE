// src/pages/customer/ConfirmPage.tsx
import { useCart } from '@/contexts/CartContext'
import { useTable } from '@/contexts/TableContext'
import { postCustomerOrder } from '@/api/customer'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ConfirmPage() {
  const { cart, clear } = useCart()
  const { tableId } = useTable()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const handleOrder = async () => {
    if (!tableId || cart.length === 0) return
    setLoading(true)
    try {
      const items = cart.map(i => ({ menuId: i.menuId, quantity: i.quantity }))
      const res = await postCustomerOrder(Number(tableId), items)
      const orderId = res.data.data.orderId
      clear()                      // 장바구니 비우기
      nav(`/customer/${tableId}/orders?orderId=${orderId}`)
    } catch (e) {
      console.error('주문 실패', e)
      alert('주문에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">주문 확인</h1>
      {cart.map(i => (
        <div key={i.menuId} className="flex justify-between">
          <span>{i.name} x {i.quantity}</span>
          <span>{(i.price * i.quantity).toLocaleString()}원</span>
        </div>
      ))}
      <div className="flex justify-between font-semibold">
        <span>합계</span>
        <span>{total.toLocaleString()}원</span>
      </div>
      <button
        onClick={handleOrder}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '주문 중…' : '주문하기'}
      </button>
    </div>
  )
}

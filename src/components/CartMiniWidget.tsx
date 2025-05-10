import { useCart }    from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CartMiniWidget() {
  const { cart }   = useCart()
  const nav        = useNavigate()

  const itemCnt = cart.reduce((n, i) => n + i.quantity, 0)
  if (itemCnt === 0) return null

  const total = cart.reduce((n, i) => n + i.price * i.quantity, 0)

  return (
    <button
      onClick={() => nav('/order/confirm')}
      className="
        fixed right-4 bottom-4 sm:right-8 sm:bottom-8 z-50
        flex items-center gap-3
        bg-blue-600 hover:bg-blue-700 active:scale-95
        text-white font-semibold rounded-full shadow-lg
        transition-all duration-150
        px-5 py-3
      "
    >
      <span className="text-xl">🛒</span>
      <span className="whitespace-nowrap">
        {itemCnt}개&nbsp;|&nbsp;{total.toLocaleString()}원
      </span>
    </button>
  )
}

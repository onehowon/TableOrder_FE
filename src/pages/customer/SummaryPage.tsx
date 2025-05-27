import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

type CartState = Record<number, number>
interface LocationState { cart?: CartState }

export default function SummaryPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const initCart = (location.state as LocationState)?.cart ?? {}

  const [cart, setCart]   = useState<CartState>(initCart)
  const [menus, setMenus] = useState<MenuDTO[]>([])

  // 로컬스토리지 복원 + 메뉴 로딩
  useEffect(() => {
    if (!Object.keys(initCart).length) {
      const saved = localStorage.getItem(`cart_${tableNumber}`)
      if (saved) setCart(JSON.parse(saved))
    }
    listAllMenus()
      .then(res => setMenus(res.data.data.filter(m => m.isAvailable)))
      .catch(() => alert('메뉴 로딩에 실패했습니다.'))
  }, [tableNumber, initCart])

  // cart → list items
  const items = menus
    .filter(m => cart[m.id] != null)
    .map(m => ({
      menuId: m.id,
      name: m.name,
      imageUrl: m.imageUrl ?? '/placeholder.png',
      quantity: cart[m.id]!,
      subtotal: m.price * cart[m.id]!,
    }))

  const total = items.reduce((sum, it) => sum + it.subtotal, 0)

  const handleVerify = () =>
    navigate(`/customer/${tableNumber}/verify`, { state: { cart } })

  const clearCart = () => {
    if (!confirm('장바구니를 비우시겠습니까?')) return
    localStorage.removeItem(`cart_${tableNumber}`)
    setCart({})
  }

  return (
    <div className="relative w-full h-screen bg-green-50 flex flex-col font-woowahan">
      {/* 헤더 */}
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold leading-tight">
          <span className="text-green-600">아이비즈</span>의<br/>
          폭싹 속았슈퍼
        </h1>
      </div>

      {/* 탭 (장바구니) */}
      <div className="px-4 flex border-b border-gray-200 mt-4">
        <div className="pb-2 flex items-center space-x-2 text-base font-medium text-green-600 border-b-2 border-green-600 font-bold">
          <span>🛒</span><span>장바구니</span>
        </div>
      </div>

      {/* 아이템 리스트 */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {items.length === 0
          ? <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
          : items.map(it => (
            <div
              key={it.menuId}
              className="flex items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <img
                src={it.imageUrl}
                alt={it.name}
                className="w-12 h-12 rounded object-cover mr-4"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  {it.name} × {it.quantity}개
                </p>
                <p className="text-gray-600 text-sm">
                  {it.subtotal.toLocaleString()}원
                </p>
              </div>
            </div>
          ))
        }
      </div>

      {/* 합계 & 주문/이전 버튼 */}
      <div className="fixed bottom-0 left-0 w-full bg-green-50 px-4 py-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-400 text-white px-5 py-3 rounded-full font-bold"
        >
          이전으로
        </button>
        <button
          onClick={clearCart}
          className="text-gray-600 hover:text-red-500 text-xl"
          title="장바구니 비우기"
        >🗑️</button>
        <button
          onClick={handleVerify}
          className="bg-green-600 text-white px-5 py-3 rounded-full font-bold"
        >
          주문하기
        </button>
      </div>

      {/* 총 금액 & 계좌 */}
      <div className="px-4 mb-36">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg text-gray-700 font-bold">총 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {total.toLocaleString()}원
          </span>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center mb-2">
          계좌번호: 카카오뱅크 3333-27-0930198 (한원보)
        </div>
        <p className="text-center text-sm text-gray-600 font-bold">
          🚨 주문 전 입금 잊지 말아 주세요!
        </p>
      </div>
    </div>
  )
}

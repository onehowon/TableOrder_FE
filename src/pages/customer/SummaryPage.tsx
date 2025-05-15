// src/pages/customer/SummaryPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { listAllMenus, postOrder } from '../../api'
import type { MenuDTO } from '../../api'

type CartState = Record<number, number>
interface LocationState { cart?: CartState }

export default function SummaryPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const passedCart = (location.state as LocationState)?.cart ?? {}

  // 1) 뒤로 가기
  const goBack = () => navigate(-1)

  // 2) 상태
  const [cart, setCart] = useState<CartState>(passedCart)
  const [menus, setMenus] = useState<MenuDTO[]>([])

  useEffect(() => {
    // 로컬스토리지에서 복원
    if (!Object.keys(passedCart).length) {
      const saved = localStorage.getItem(`cart_${tableNumber}`)
      if (saved) setCart(JSON.parse(saved))
    }
    // 메뉴 전체 로드 (품절 제외)
    listAllMenus()
      .then(res =>
        setMenus(res.data.data.filter(m => m.isAvailable))
      )
      .catch(() => alert('메뉴 로딩에 실패했습니다.'))
  }, [tableNumber, passedCart])

  // 장바구니에 담긴 아이템만
  const items = menus
    .filter(m => cart[m.id] != null)
    .map(m => ({
      menuId: m.id,
      name: m.name,
      imageUrl: m.imageUrl ?? '/placeholder.png',
      quantity: cart[m.id]!,
      subtotal: m.price * cart[m.id]!,
    }))

  const totalAmount = items.reduce((sum, it) => sum + it.subtotal, 0)

  // 주문 API 호출
  const handleOrder = () => {
        navigate(`/customer/${tableNumber}/verify`, {
          state: { cart }
        })
      }

  return (
    <div className="relative w-full min-h-screen bg-green-50 flex flex-col font-woowahan">
      {/* 1) 헤더 타이틀 */}
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold leading-tight">
          <span className="text-green-600">아이비즈</span>의<br/>
          폭싹 속았슈퍼
        </h1>
      </div>

      {/* 2) 카테고리 탭 (장바구니) */}
      <div className="px-4 flex border-b border-gray-200 mt-4">
        <div className="pb-2 flex items-center space-x-2 text-base font-medium text-green-600 border-b-2 border-green-600">
          <span>🛒</span>
          <span>장바구니</span>
        </div>
      </div>

      {/* 3) 아이템 리스트 */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
        ) : (
          items.map(it => (
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
        )}
      </div>

      {/* 4) 합계 & 주문 버튼 */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-gray-700">총 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {totalAmount.toLocaleString()}원
          </span>
        </div>

        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
          계좌번호: 신한 123-4567-8910-11 (한원보)
        </div>

        <p className="text-center text-sm text-gray-600 mb-4">
          🚨 주문 전 입금 잊지 말아 주세요!
        </p>

        <button
          onClick={handleOrder}
          className="w-full py-4 bg-green-600 text-white rounded-full text-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
        >
          주문하기
        </button>
      </div>
    </div>
  )
}

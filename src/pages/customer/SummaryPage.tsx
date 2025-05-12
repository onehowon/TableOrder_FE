import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { listMenus, postOrder } from '../../api'
import type { MenuDTO, CommonResp } from '../../api'
import type { AxiosResponse } from 'axios'
import engineLogo from '../../assets/engine.png'

type CartState = Record<number, number>

interface LocationState {
  cart?: CartState
}

export default function SummaryPage() {
  const { tableNumber } = useParams<{ tableNumber?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const passedCart = (location.state as LocationState)?.cart ?? {}

  if (!tableNumber) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">테이블 번호가 없습니다.</p>
      </div>
    )
  }

  // 뒤로 가기
  const goBack = () => navigate(-1)

  // cart 초기값: nav.state 우선, 없으면 localStorage
  const [cart, setCart] = useState<CartState>(passedCart)
  const [menus, setMenus] = useState<MenuDTO[]>([])

  useEffect(() => {
    if (!Object.keys(passedCart).length) {
      const saved = localStorage.getItem(`cart_${tableNumber}`)
      if (saved) setCart(JSON.parse(saved))
    }
    listMenus()
      .then((res: AxiosResponse<CommonResp<MenuDTO[]>>) => {
        setMenus(res.data.data)
      })
      .catch(() => {
        alert('메뉴 로딩에 실패했습니다.')
      })
  }, [tableNumber, passedCart])

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

  const handleOrder = async () => {
    try {
      await postOrder({
        tableNumber: Number(tableNumber),
        items: items.map(it => ({
          menuId: it.menuId,
          quantity: it.quantity,
        })),
      })
      // 주문 성공 → 주문 완료 페이지로 이동
      navigate(`/customer/${tableNumber}/placed`, { replace: true })
    } catch {
      alert('주문 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="flex items-center px-4 py-3 bg-white shadow-md">
        <button
          onClick={goBack}
          className="text-gray-700 text-lg hover:text-gray-900 transition"
        >
          ← 이전 화면
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold text-gray-800">
          장바구니
        </h1>
        <img
          src={engineLogo}
          alt="EngiNE"
          className="w-20 h-auto object-contain"
        />
      </header>

      {/* 아이템 리스트 */}
      <main className="flex-1 p-4 space-y-3 overflow-auto">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
        ) : (
          items.map(it => (
            <div
              key={it.menuId}
              className="flex items-center bg-white p-3 rounded-lg shadow-sm"
            >
              <img
                src={it.imageUrl}
                alt={it.name}
                className="w-12 h-12 rounded mr-4 object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {it.name} × {it.quantity}개
                </p>
                <p className="text-sm text-gray-500">
                  {it.subtotal.toLocaleString()}원
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 합계 & 주문 버튼 */}
      <footer className="bg-white p-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="text-lg text-gray-700">총 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          <p>계좌번호</p>
          <p>한원보 신한 123-4567-8910-11</p>
        </div>
        <button
          onClick={handleOrder}
          className="w-full py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700 transition"
        >
          주문하기
        </button>
      </footer>
    </div>
  )
}

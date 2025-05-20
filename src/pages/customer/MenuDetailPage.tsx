// src/pages/customer/MenuDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

interface CartState {
  [menuId: number]: number
}

type Params = {
  tableNumber: string
  id: string
}

export default function MenuDetailPage() {
  const { tableNumber, id } = useParams<Params>()
  const navigate = useNavigate()

  const [menu, setMenu] = useState<MenuDTO | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

  // 1) 메뉴 로드
  useEffect(() => {
    listAllMenus()
      .then(res => {
        const found = res.data.data.find(m => String(m.id) === id)
        if (!found) {
          alert('존재하지 않는 메뉴입니다.')
          navigate(-1)
          return
        }
        setMenu(found)
      })
      .catch(() => {
        alert('메뉴 정보를 불러오는 데 실패했습니다.')
        navigate(-1)
      })
  }, [id, navigate])

  if (!menu) return null

  // 2) 장바구니 담기
  const onAddToCart = () => {
    const key = `cart_${tableNumber}`
    const saved = localStorage.getItem(key)
    const cart: CartState = saved ? JSON.parse(saved) : {}
    cart[menu.id] = (cart[menu.id] || 0) + quantity
    localStorage.setItem(key, JSON.stringify(cart))
    setShowConfirm(true)
  }

  // 3) 모달 확인
  const onConfirm = () => {
    setShowConfirm(false)
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-white flex justify-center py-6 px-4">
      {/* ▽ 카드 컨테이너 ▽ */}
      <div className="w-full max-w-xs bg-white rounded-xl overflow-hidden shadow-md">
        {/* — 헤더 — */}
        <div className="px-4 pt-4">
          {/* 브랜드 텍스트 */}
          <div className="text-green-600 font-medium">아이비즈의</div>
          {/* 메뉴명 */}
          <div className="text-xl font-bold text-gray-900">{menu.name}</div>
          {/* 언더라인 */}
          <div className="mt-1 w-12 border-b-2 border-green-600"></div>
          {/* 상세설명 탭 */}
          <div className="mt-2 text-green-600 font-medium underline">상세설명</div>
        </div>

        {/* — 이미지 — */}
        <img
          src={menu.imageUrl ?? '/placeholder.png'}
          alt={menu.name}
          className="w-full h-48 object-cover mt-2"
        />

        {/* — 포스트잇 패널 — */}
        <div className="relative m-4 p-4 bg-yellow-100 rounded-lg shadow-inner">
          {/* 테이프 */}
          <div className="absolute top-0 left-1/2 w-16 h-2 bg-yellow-200
                          transform -translate-x-1/2 -translate-y-2 rotate-3 rounded-sm" />
          {/* 메뉴명(스티커 타이틀) */}
          <h3 className="text-green-700 font-semibold text-center">
            {menu.name}
          </h3>
          {/* 가격 */}
          <p className="text-gray-900 font-bold text-center mt-1">
            {menu.price.toLocaleString()}원
          </p>
          {/* 설명 */}
          <p className="mt-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {menu.description ?? '상세 설명이 없습니다.'}
          </p>
        </div>

        {/* — 버튼 그룹 — */}
        <div className="flex px-4 pb-4 space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 bg-pink-300 text-white rounded-full text-sm
                       hover:bg-pink-400 transition"
          >
            이전화면 가기
          </button>
          <button
            onClick={onAddToCart}
            className="flex-1 py-2 bg-green-700 text-white rounded-full text-sm
                       hover:bg-green-800 transition"
          >
            장바구니 가기
          </button>
        </div>
      </div>

      {/* — 확인 모달 — */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-xs text-center">
            <p className="mb-4">
              {menu.name} {quantity}개가 장바구니에 추가되었습니다.
            </p>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-green-700 text-white rounded-full
                         hover:bg-green-800 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

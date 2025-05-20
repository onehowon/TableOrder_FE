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

  // 메뉴 로드
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

  // 장바구니 담기
  const onAddToCart = () => {
    const key = `cart_${tableNumber}`
    const saved = localStorage.getItem(key)
    const cart: CartState = saved ? JSON.parse(saved) : {}
    cart[menu.id] = (cart[menu.id] || 0) + quantity
    localStorage.setItem(key, JSON.stringify(cart))
    setShowConfirm(true)
  }

  // 모달 확인
  const onConfirm = () => {
    setShowConfirm(false)
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* 카드 컨테이너 */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <header className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-green-700">{menu.name}</h1>
          <button
            onClick={() => {}}
            className="mt-1 text-sm font-medium text-green-700 underline"
          >
            상세설명
          </button>
        </header>

        {/* 메뉴 이미지 */}
        <img
          src={menu.imageUrl ?? '/placeholder.png'}
          alt={menu.name}
          className="w-full h-48 object-cover"
        />

        {/* 스티키 노트 스타일 패널 */}
        <section className="p-6 bg-yellow-100 relative">
          {/* 포스트잇 테이프 */}
          <div className="absolute top-0 left-1/2 w-12 h-4 bg-yellow-200 transform -translate-x-1/2 -translate-y-1/2 rotate-2 rounded-sm"></div>
          <h2 className="text-lg font-semibold">{menu.name}</h2>
          <p className="text-2xl font-bold mt-1">{menu.price.toLocaleString()}원</p>
          <p className="mt-3 text-gray-700 whitespace-pre-wrap">
            {menu.description ?? '상세 설명이 없습니다.'}
          </p>
        </section>

        {/* 버튼 그룹 */}
        <div className="px-6 py-4 flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition"
          >
            이전화면 가기
          </button>
          <button
            onClick={onAddToCart}
            className="flex-1 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
          >
            장바구니 가기
          </button>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-xs text-center">
            <p className="mb-4">
              {menu.name} {quantity}개가 장바구니에 추가되었습니다.
            </p>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

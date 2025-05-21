// src/pages/customer/MenuDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

// 메뉴별 post-it PNG import
import tteokPostit     from '@/assets/복순이 떡볶이.png'
import fryRicePostit   from '@/assets/신라면 볶음밥.png'
import odengPostit     from '@/assets/오뎅탕.png'
import bibimSamgPostit from '@/assets/비빔삼겹.png'
import lemonPostit     from '@/assets/레몬소주.png'
import misutPostit     from '@/assets/미숫가루.png'
import tonkatsuPostit  from '@/assets/피카츄 돈까스.png'
import snackPostit     from '@/assets/수영이의 첫사랑 간식.png'
import grapePostit     from '@/assets/포도소주.png'
import buldakPostit    from '@/assets/엄마의 속앓이 불닭.png'

interface CartState { [menuId: number]: number }
type Params = { tableNumber: string; id: string }

// DB id → post-it PNG 매핑
const postitMap: Record<number, string> = {
  18: tteokPostit,
  19: fryRicePostit,
  20: odengPostit,
  21: bibimSamgPostit,
  23: lemonPostit,
  24: misutPostit,
  25: tonkatsuPostit,
  26: snackPostit,
  27: grapePostit,
  28: buldakPostit,
}

export default function MenuDetailPage() {
  const { tableNumber, id } = useParams<Params>()
  const navigate = useNavigate()

  const [menu, setMenu] = useState<MenuDTO | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

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

  const postitImg = postitMap[menu.id] ?? '/placeholder.png'

  const onAddToCart = () => {
    const key = `cart_${tableNumber}`
    const saved = localStorage.getItem(key)
    const cart: CartState = saved ? JSON.parse(saved) : {}
    cart[menu.id] = (cart[menu.id] || 0) + quantity
    localStorage.setItem(key, JSON.stringify(cart))
    setShowConfirm(true)
  }

  const onConfirm = () => {
    setShowConfirm(false)
    navigate(-1)
  }

  return (
    <div className="w-full h-screen bg-green-50 flex flex-col items-center justify-center p-4 font-woowahan">
      <div className="w-full max-w-xs bg-white rounded-xl shadow-md overflow-hidden">
        {/* ───────── 헤더 ───────── */}
        <div className="px-4 pt-6 text-left">
          <div className="text-green-600 font-medium">아이비즈의</div>
          <div className="text-lg font-bold text-gray-900 mt-1">폭싹 속았슈퍼</div>
          {/* 상세설명 */}
          <h1 className="mt-3 text-3xl font-extrabold text-green-600">
            상세설명
          </h1>
          <div className="mt-2 w-16 h-1 bg-green-600 rounded"></div>
        </div>

        {/* ───────── 메뉴 이미지 ───────── */}
        <img
          src={menu.imageUrl ?? '/placeholder.png'}
          alt={menu.name}
          className="w-full h-56 object-cover mt-4"
        />

        {/* ───────── post-it PNG ───────── */}
        <div className="p-4">
          <img
            src={postitImg}
            alt={`${menu.name} 포스트잇`}
            className="w-full rounded-lg shadow-inner"
          />
        </div>

        {/* ───────── 버튼 두 개 ───────── */}
        <div className="flex px-4 pb-4 space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 bg-pink-300 text-white rounded-full text-sm hover:bg-pink-400 transition"
          >
            이전화면 가기
          </button>
          <button
            onClick={onAddToCart}
            className="flex-1 py-2 bg-green-700 text-white rounded-full text-sm hover:bg-green-800 transition"
          >
            장바구니 가기
          </button>
        </div>
      </div>

      {/* ───────── 확인 모달 ───────── */}
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

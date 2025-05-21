// src/pages/customer/MenuDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

// 디자인용 포스트잇 PNG
import postitSrc from '@/assets/포스트잇.png'

// 메뉴별 사진 PNG
import boksooniTteokImg      from '@/assets/복순이 떡볶이.png'
import fryRiceImg             from '@/assets/신라면 볶음밥.png'
import odengTangImg           from '@/assets/오뎅탕.png'
import bibimSamgImg           from '@/assets/비빔삼겹.png'
import lemonSojuImg           from '@/assets/레몬소주.png'
import misugaruImg            from '@/assets/미숫가루.png'
import tonkatsuImg            from '@/assets/피카츄 돈까스.png'
import sooyoungSnackImg       from '@/assets/수영이의 첫사랑 간식.png'
import bulDakImg              from '@/assets/엄마의 속앓이 불닭.png'

interface CartState {
  [menuId: number]: number
}
type Params = { tableNumber: string; id: string }

// DB의 id에 맞춰 자산을 매핑
const imageById: Record<number, string> = {
  18: boksooniTteokImg,    // 복순이 떡볶이 - 살민 살아진다
  19: fryRiceImg,          // 아재의 놀린 속 볶음밥 - 신라면 볶음밥
  20: odengTangImg,        // 춘자 이모네 해장 오뎅탕
  21: bibimSamgImg,        // 민석이의 관심법 비빔삼겹
  23: lemonSojuImg,        // 민석이의 눈물 레몬소주
  24: misugaruImg,         // 춘자 이모표 구수한 한 잔
  25: tonkatsuImg,         // 복순이의 도시락 속 추억 돈까스
  26: sooyoungSnackImg,    // 수영이 첫사랑 간식
  27: misugaruImg,         // (중복) 춘자 이모표 구수한 한 잔
  28: bulDakImg,           // 엄마의 속앓이 불닭
}

export default function MenuDetailPage() {
  const { tableNumber, id } = useParams<Params>()
  const navigate = useNavigate()

  const [menu, setMenu] = useState<MenuDTO | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

  // 메뉴 정보 로드
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

  // id 기반으로 자산 선택, 없으면 placeholder
  const menuImg = imageById[menu.id] ?? '/placeholder.png'

  // 수량 조절
  const add    = () => setQuantity(q => q + 1)
  const remove = () => setQuantity(q => Math.max(1, q - 1))

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
    <div className="min-h-screen bg-white flex justify-center py-6 px-4">
      <div className="w-full max-w-xs bg-white rounded-xl overflow-hidden shadow-md">
        {/* 헤더 */}
        <div className="px-4 pt-4">
          <div className="text-green-600 font-medium">아이비즈의</div>
          <div className="text-xl font-bold text-gray-900">{menu.name}</div>
          <div className="mt-1 w-12 border-b-2 border-green-600"></div>
          <div className="mt-2 text-green-600 font-medium underline">
            상세설명
          </div>
        </div>

        {/* 동적 메뉴 이미지 */}
        <img
          src={menuImg}
          alt={menu.name}
          className="w-full h-48 object-cover mt-2"
        />

        {/* 포스트잇 패널 */}
        <div className="relative m-4">
          <div
            className="w-full bg-no-repeat bg-center bg-cover rounded-lg overflow-hidden"
            style={{ backgroundImage: `url(${postitSrc})` }}
          >
            <div className="p-4">
              <h3 className="text-green-700 font-semibold text-center">
                {menu.name}
              </h3>
              <p className="text-gray-900 font-bold text-center mt-1">
                {menu.price.toLocaleString()}원
              </p>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {menu.description ?? '상세 설명이 없습니다.'}
              </p>
            </div>
          </div>
          {/* 테이프 느낌 CSS */}
          <div className="absolute top-0 left-1/2 w-16 h-2 bg-yellow-200
                          transform -translate-x-1/2 -translate-y-2 rotate-3
                          rounded-sm" />
        </div>

        {/* 수량 + 버튼 그룹 */}
        <div className="flex items-center px-4 pb-4 space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 bg-pink-300 text-white rounded-full text-sm
                       hover:bg-pink-400 transition"
          >
            이전화면 가기
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={remove}
              className="w-8 h-8 flex items-center justify-center border
                         border-gray-300 rounded-full text-gray-800
                         hover:bg-gray-100 transition"
            >
              −
            </button>
            <span className="w-6 text-center text-lg">{quantity}</span>
            <button
              onClick={add}
              className="w-8 h-8 flex items-center justify-center border
                         border-gray-300 rounded-full text-gray-800
                         hover:bg-gray-100 transition"
            >
              ＋
            </button>
          </div>

          <button
            onClick={onAddToCart}
            className="flex-1 py-2 bg-green-700 text-white rounded-full text-sm
                       hover:bg-green-800 transition"
          >
            장바구니 담기
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

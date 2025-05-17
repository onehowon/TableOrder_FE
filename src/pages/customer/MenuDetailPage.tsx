import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'
import logoSrc from '@/assets/engine.png'

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

  // 메뉴 로드 및 선택
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

  // 수량 조절
  const add = () => setQuantity(q => q + 1)
  const remove = () => setQuantity(q => Math.max(1, q - 1))

  // 장바구니로 이동
  const goSummary = () => {
       const key = `cart_${tableNumber}`
       // 기존 cart 가져오기
       const saved = localStorage.getItem(key)
       const cart: CartState = saved ? JSON.parse(saved) : {}
       // 현재 메뉴 수량 누적
       cart[menu.id] = (cart[menu.id] || 0) + quantity
       localStorage.setItem(key, JSON.stringify(cart))
       // 알림 (선택)
       alert(`${menu.name} ${quantity}개가 장바구니에 추가되었습니다.`)
       // 메뉴 리스트로 돌아가기
       navigate(-1)
     }

  return (
    <div className="w-full h-screen bg-green-50 flex flex-col font-woowahan">
      {/* 로고 */}
      <div className="px-4 pt-4">
        <img src={logoSrc} alt="EngiNE" className="h-12 object-contain mx-auto" />
      </div>

      {/* 상세 이미지 */}
      <img
        src={menu.imageUrl ?? '/placeholder.png'}
        alt={menu.name}
        className="w-full h-48 object-cover mt-4"
      />

      {/* 제목 & 가격 */}
      <div className="px-4 mt-4 text-center">
        <h2 className="text-2xl font-bold">{menu.name}</h2>
        <p className="text-lg text-gray-700 mt-1">
          {menu.price.toLocaleString()}원
        </p>
      </div>

      {/* 설명 */}
      <div className="px-4 py-3 text-gray-600 flex-1 overflow-auto">
        <p className="leading-relaxed">
          {menu.description ?? '상세 설명이 없습니다.'}
        </p>
      </div>

      {/* 수량 및 담기 */}
      <div className="px-4 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={remove}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-800 hover:bg-gray-100 transition"
          >
            –
          </button>
          <span className="w-6 text-center text-lg">{quantity}</span>
          <button
            onClick={add}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-800 hover:bg-gray-100 transition"
          >
            ＋
          </button>
        </div>
        <button
          onClick={goSummary}
          className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  )
}
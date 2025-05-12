// src/pages/customer/SummaryPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { listMenus, postOrder } from '../../api'
import type { MenuDTO, CommonResp } from '../../api'
import type { AxiosResponse } from 'axios'

type CartState = Record<number, number>
interface LocationState { cart: CartState }

export default function SummaryPage() {
  const { tableNumber } = useParams()         // 제네릭 제거
  if (!tableNumber) return <p>테이블 번호가 없습니다.</p>

  const navigate = useNavigate()

  // useLocation 제네릭 제거, 단언으로 state 타입 지정
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}
  const cart = state.cart

  const [menus, setMenus] = useState<MenuDTO[]>([])

  useEffect(() => {
    listMenus()
      .then((res: AxiosResponse<CommonResp<MenuDTO[]>>) => {
        setMenus(res.data.data)
      })
      .catch(() => {
        alert('메뉴 로딩에 실패했습니다.')
      })
  }, [])

  const items = menus
    .filter(m => cart[m.id] != null)
    .map(m => ({ menuId: m.id, quantity: cart[m.id]! }))

  const totalAmount = items.reduce((sum, it) => {
    const menu = menus.find(m => m.id === it.menuId)!
    return sum + menu.price * it.quantity
  }, 0)

  const handleOrder = async () => {
    try {
      await postOrder({ tableNumber: Number(tableNumber), items })
      alert('주문이 정상 접수되었습니다.')
      navigate(`/customer/${tableNumber}/orders`, { replace: true })
    } catch {
      alert('주문이 실패했습니다.')
    }
  }

  return (
    <div className="w-full h-screen bg-white p-4 flex flex-col">
      <div className="flex-1 overflow-auto space-y-2">
        {items.map((it, idx) => {
          const menu = menus.find(m => m.id === it.menuId)!
          return (
            <div key={idx} className="flex justify-between py-2 border-b">
              <span className="font-medium">{menu.name}</span>
              <span>{it.quantity}개</span>
              <span>{(menu.price * it.quantity).toLocaleString()}원</span>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t flex justify-between items-center">
        <span className="text-lg font-bold">
          총 금액: {totalAmount.toLocaleString()}원
        </span>
        <button
          onClick={handleOrder}
          className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          주문하기
        </button>
      </div>
    </div>
  )
}

// src/pages/customer/SummaryPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import type { MenuDTO } from '../../api'
import { listMenus } from '../../api'

type CartState = Record<number, number>

interface LocationState {
  cart: CartState
}

export default function SummaryPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()

  // useLocation 에서 state 를 꺼내올 때는 단언(as) 처리
  const location = useLocation()
  const cart: CartState = (location.state as LocationState)?.cart || {}

  const [menus, setMenus] = useState<MenuDTO[]>([])

  useEffect(() => {
    listMenus()
      .then(res => {
        // res.data: CommonResp<MenuDTO[]>, res.data.data: MenuDTO[]
        setMenus(res.data.data)
      })
      .catch(() => {
        alert('메뉴 정보를 불러오는 데 실패했습니다.')
      })
  }, [])

  const items = menus
    .filter(m => Boolean(cart[m.id]))
    .map(m => ({
      ...m,
      quantity: cart[m.id],
      total: m.price * cart[m.id]
    }))

  const totalAmount = items.reduce((sum, it) => sum + it.total, 0)

  return (
    <div className="w-full h-screen bg-white p-4 flex flex-col">
      <header className="text-center font-bold mb-4">장바구니</header>

      <div className="flex-1 overflow-auto space-y-4">
        {items.map(it => (
          <div key={it.id} className="flex items-center">
            <img
              src={it.imageUrl ?? ''}
              alt={it.name}
              className="w-12 h-12 rounded mr-3 object-cover"
            />
            <div className="flex-1">
              <div className="font-medium">
                {it.name} × {it.quantity}
              </div>
              <div className="text-sm text-gray-600">
                {it.total.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-lg font-semibold">
          총 금액: {totalAmount.toLocaleString()}원
        </div>
        <div className="text-sm leading-relaxed">
          계좌번호<br />
          하나은행<br />
          신한 123-4567-8910-11
        </div>
      </div>

      <button
        onClick={() => {
          /* TODO: postRequest 호출 로직 추가 */
          alert('주문이 접수되었습니다.')
        }}
        className="mt-4 py-3 bg-green-600 text-white rounded text-lg"
      >
        주문하기
      </button>

      <button
        onClick={() => nav(-1)}
        className="mt-2 py-2 text-gray-700"
      >
        ← 이전 화면
      </button>
    </div>
  )
}

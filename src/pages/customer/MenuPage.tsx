// src/pages/customer/MenuPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listMenus } from '@/api'
import type { MenuDTO } from '@/api'

type Category = MenuDTO['category']
const CATEGORIES: Category[] = ['MAIN', 'SIDE', 'BEVERAGE']
const CATEGORY_LABEL: Record<Category, string> = {
  MAIN: '메인',
  SIDE: '사이드',
  BEVERAGE: '주류',
}

export default function MenuPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()
  const tblNo = Number(tableNumber)

  // 상태
  const [tab, setTab] = useState<Category>('MAIN')
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [cart, setCart] = useState<Record<number, number>>({})

  // 1) 탭 변경 또는 테이블번호 변경 시마다 다시 조회
  useEffect(() => {
    listMenus(tblNo, tab)
      .then(res => setMenus(res.data.data))
      .catch(() => alert('메뉴 정보를 불러오는 데 실패했습니다.'))
  }, [tblNo, tab])

  // 2) 장바구니 수량 증감
  const add = (id: number) =>
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id: number) =>
    setCart(c => {
      const next = (c[id] || 0) - 1
      if (next <= 0) {
        const { [id]:_, ...rest } = c
        return rest
      }
      return { ...c, [id]: next }
    })

  // 3) 장바구니 페이지로 이동
  const goCart = () =>
    nav(`/customer/${tblNo}/summary`, { state: { cart } })

  return (
    <div className="relative w-full h-screen bg-green-50 flex flex-col font-woowahan">
      {/* 헤더 타이틀 */}
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold leading-tight">
          <span className="text-green-600">아이비즈</span>의<br/>
          폭싹 속았슈퍼
        </h1>
      </div>

      {/* 카테고리 탭 */}
      <div className="px-4 flex space-x-6 border-b border-gray-200 mt-4">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`
              pb-2 text-base font-medium
              ${tab === c
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'}
            `}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      {/* 메뉴 리스트: 흰 배경 카드 안에 */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {menus.map(menu => (
          <div
            key={menu.id}
            className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={menu.imageUrl ?? ''}
                alt={menu.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <div className="text-lg font-medium">{menu.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {menu.price.toLocaleString()}원
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => remove(menu.id)}
                className="w-8 h-8 flex items-center justify-center border rounded-full text-lg text-gray-700"
              >
                －
              </button>
              <span className="w-6 text-center">{cart[menu.id] || 0}</span>
              <button
                onClick={() => add(menu.id)}
                className="w-8 h-8 flex items-center justify-center border rounded-full text-lg text-gray-700"
              >
                ＋
              </button>
              <button
                onClick={() => add(menu.id)}
                className="ml-2 bg-green-600 text-white px-3 py-1 rounded-full shadow hover:bg-green-700 transition-colors"
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 고정된 장바구니 버튼 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md">
        <button
          onClick={goCart}
          className="w-full bg-green-600 text-white py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
        >
          🛒 장바구니 가기
        </button>
      </div>
    </div>
  )
}

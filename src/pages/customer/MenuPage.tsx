// src/pages/customer/MenuPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

const CATEGORIES: { key: MenuDTO['category']; label: string }[] = [
  { key: 'MAIN',     label: '메인'  },
  { key: 'SIDE',     label: '사이드' },
  { key: 'BEVERAGE', label: '주류'  },
]

export default function MenuPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()
  const [tab, setTab]     = useState<MenuDTO['category']>('MAIN')
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [cart, setCart]   = useState<Record<number, number>>({})

  // 1) 전체 메뉴 로드 (품절 제외)
  useEffect(() => {
    listAllMenus()
      .then(res => setMenus(res.data.data.filter(m => m.isAvailable)))
      .catch(() => alert('메뉴 정보를 불러오는 데 실패했습니다.'))
  }, [])

  // 2) 카테고리 필터링
  const filtered = menus.filter(m => m.category === tab)

  // 3) 수량 증감
  const add = (id: number) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id: number) => setCart(c => {
    const next = (c[id] || 0) - 1
    if (next <= 0) {
      const { [id]: _, ...rest } = c
      return rest
    }
    return { ...c, [id]: next }
  })

  // 4) 장바구니 페이지 이동
  const goCart = () =>
    nav(`/customer/${tableNumber}/summary`, { state: { cart } })

  return (
    <div className="w-full h-screen bg-green-50 flex flex-col font-woowahan">
      {/* 헤더 */}
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold leading-tight">
          <span className="text-green-600">아이비즈</span>의<br/>
          폭싹 속았슈퍼
        </h1>
      </div>

      {/* 카테고리 탭 */}
      <div className="px-4 mt-4 border-b border-gray-200 flex space-x-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setTab(cat.key)}
            className={`
              pb-2 text-base font-medium
              ${tab === cat.key
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {filtered.map(menu => (
          <div
            key={menu.id}
            className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={menu.imageUrl ?? '/placeholder.png'}
                alt={menu.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-lg font-medium">{menu.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {menu.price.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => remove(menu.id)}
                className="w-8 h-8 flex items-center justify-center border rounded-full text-gray-800"
              >
                －
              </button>
              <span className="w-6 text-center">{cart[menu.id] || 0}</span>
              <button
                onClick={() => add(menu.id)}
                className="w-8 h-8 flex items-center justify-center border rounded-full text-gray-800"
              >
                ＋
              </button>
              <button
                onClick={() => add(menu.id)}
                className="ml-2 bg-green-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-green-700 transition-colors"
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 내비게이션 */}
      <div className="flex justify-between px-4 pb-6 bg-green-50">
        <button
          onClick={() => nav(-1)}
          className="bg-red-400 text-white px-4 py-3 rounded-full shadow-md hover:bg-red-500 transition-colors"
        >
          ← 이전화면 가기
        </button>
        <button
          onClick={goCart}
          className="bg-green-600 text-white px-4 py-3 rounded-full shadow-md hover:bg-green-700 transition-colors"
        >
          장바구니 가기 →
        </button>
      </div>
    </div>
  )
}

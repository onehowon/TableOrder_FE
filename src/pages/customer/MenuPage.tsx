// src/pages/customer/MenuPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

const CATEGORIES = [
  { key: 'MAIN',     label: '메인'  },
  { key: 'SIDE',     label: '사이드' },
  { key: 'BEVERAGE', label: '주류'  },
] as const

export default function MenuPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()

  type CategoryKey = typeof CATEGORIES[number]['key']

  const [tab, setTab]     = useState<CategoryKey>('MAIN')
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [cart, setCart]   = useState<Record<number, number>>({})
  const [toast, setToast] = useState(false)

  // 로컬스토리지 키
  const CART_KEY = `cart_${tableNumber}`

  // 초기 로드: 메뉴 + 기존 카트
  useEffect(() => {
    listAllMenus()
      .then(res => setMenus(res.data.data.filter(m => m.isAvailable)))
      .catch(() => alert('메뉴 정보를 불러오는 데 실패했습니다.'))

    const saved = localStorage.getItem(CART_KEY)
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // 토스트 자동 닫기
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(false), 2000)
      return () => clearTimeout(t)
    }
  }, [toast])

  // 현재 탭의 메뉴
  const filtered = menus.filter(m => m.category === tab)

  // 배지에 표시할 총 개수
  const totalCount = Object.values(cart).reduce((sum, v) => sum + v, 0)

  // localStorage에 저장 & state 갱신 & 토스트
  const addToCart = (menuId: number) => {
    const next = { ...cart, [menuId]: (cart[menuId] || 0) + 1 }
    setCart(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
    setToast(true)
  }

  const removeFromCart = (menuId: number) => {
    const curr = cart[menuId] || 0
    const next =
      curr > 1
        ? { ...cart, [menuId]: curr - 1 }
        : Object.fromEntries(Object.entries(cart).filter(([k]) => +k !== menuId))
    setCart(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }

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
      <div className="mt-4 flex border-b border-gray-200">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setTab(cat.key)}
            className={`flex-1 text-center pb-2 font-bold ${
              tab === cat.key
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex-1 overflow-auto px-4 py-2 pb-24 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            해당 카테고리에 메뉴가 없습니다.
          </p>
        ) : (
          filtered.map(menu => (
            <div
              key={menu.id}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between relative"
            >
              {/* 상세 이동 */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => nav(`/customer/${tableNumber}/menu/${menu.id}`)}
              >
                <img
                  src={menu.imageUrl ?? '/placeholder.png'}
                  alt={menu.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="ml-4 min-w-0">
                  <p className="text-base font-medium truncate">{menu.name}</p>
                  <p className="text-sm text-gray-600">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 수량/담기 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={e => { e.stopPropagation(); removeFromCart(menu.id) }}
                  className="w-8 h-8 border rounded-full text-lg hover:bg-gray-100"
                >－</button>
                <span>{cart[menu.id] || 0}</span>
                <button
                  onClick={e => { e.stopPropagation(); addToCart(menu.id) }}
                  className="w-8 h-8 border rounded-full text-lg hover:bg-gray-100"
                >＋</button>
                <button
                  onClick={e => { e.stopPropagation(); addToCart(menu.id) }}
                 className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                >담기</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 내비 + 배지 */}
      <div className="fixed bottom-0 left-0 w-full bg-green-50 px-4 py-4 flex justify-between z-10">
        <button
          onClick={() => nav(-1)}
          className="bg-red-400 text-white px-5 py-3 rounded-full font-bold"
        >
          이전화면 가기
        </button>
        <div className="relative">
          <button
            onClick={goCart}
            className="bg-green-600 text-white px-5 py-3 rounded-full font-bold"
          >
            장바구니 보기
          </button>
          {totalCount > 0 && (
            <span className="
              absolute -top-2 -right-2
              bg-red-500 text-white text-xs font-bold
              w-5 h-5 rounded-full flex items-center justify-center
            ">
              {totalCount}
            </span>
          )}
        </div>
      </div>

      {/* 토스트 메시지 */}
      {toast && (
        <div className="
          absolute
          bottom-32 left-1/2 transform -translate-x-1/2
          bg-black bg-opacity-70 text-white px-4 py-2 rounded-full
          transition-opacity
        ">
          장바구니에 저장되었습니다.
        </div>
      )}
    </div>
  )
}

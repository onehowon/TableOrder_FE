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
  const CART_KEY = `cart_${tableNumber}`

  type Category = typeof CATEGORIES[number]['key']
  const [tab, setTab]     = useState<Category>('MAIN')
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [cart, setCart]   = useState<Record<number, number>>({})
  const [toast, setToast] = useState<string>('')

  useEffect(() => {
    listAllMenus()
      .then(res => setMenus(res.data.data.filter(m => m.isAvailable)))
      .catch(() => alert('메뉴 정보를 불러오는 데 실패했습니다.'))

    const saved = localStorage.getItem(CART_KEY)
    if (saved) {
      try { setCart(JSON.parse(saved)) }
      catch {}
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const filtered   = menus.filter(m => m.category === tab)
  const totalCount = Object.values(cart).reduce((a, b) => a + b, 0)

  const add = (id: number) => {
    const next = { ...cart, [id]: (cart[id] || 0) + 1 }
    setCart(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
    setToast('장바구니에 저장되었습니다.')
  }
  const remove = (id: number) => {
    const curr = cart[id] || 0
    const next = curr > 1
      ? { ...cart, [id]: curr - 1 }
      : Object.fromEntries(
          Object.entries(cart).filter(([k]) => +k !== id)
        )
    setCart(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }
  const clearCart = () => {
    if (!confirm('장바구니를 비우시겠습니까?')) return
    localStorage.removeItem(CART_KEY)
    setCart({})
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

      {/* 탭 */}
      <div className="mt-4 flex border-b border-gray-200">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className={`flex-1 text-center pb-2 font-bold ${
              tab === c.key
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 리스트 (grid 적용) */}
      <div className="flex-1 overflow-auto px-4 py-2 pb-32 grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            해당 카테고리에 메뉴가 없습니다.
          </p>
        ) : (
          filtered.map(menu => (
            <div
              key={menu.id}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
            >
              <div
                className="flex items-center cursor-pointer"
                onClick={() =>
                  nav(`/customer/${tableNumber}/menu/${menu.id}`)
                }
              >
                <img
                  src={menu.imageUrl || '/placeholder.png'}
                  alt={menu.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="ml-4 min-w-0">
                  <p className="text-base font-medium whitespace-normal">
                    {menu.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 수량 + 담기 박스 */}
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    remove(menu.id)
                  }}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 transition"
                >
                  －
                </button>
                <span className="w-6 text-center">{cart[menu.id] || 0}</span>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    add(menu.id)
                  }}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 transition"
                >
                  ＋
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    add(menu.id)
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
                >
                  담기
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 w-full bg-green-50 px-4 py-4 flex justify-between items-center z-10">
        <button
          onClick={() => nav(-1)}
          className="bg-red-400 text-white px-5 py-3 rounded-full font-bold"
        >
          이전화면 가기
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={clearCart}
            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-red-500"
            title="장바구니 초기화"
          >
            🗑️
          </button>
          <button
            onClick={goCart}
            className="bg-green-600 text-white px-5 py-3 rounded-full font-bold relative"
          >
            장바구니 보기
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 중앙 토스트 */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

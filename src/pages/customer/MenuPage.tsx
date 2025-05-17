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

  const [tab, setTab]     = useState<typeof CATEGORIES[number]['key']>('MAIN')
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [cart, setCart]   = useState<Record<number, number>>({})
  const [toast, setToast] = useState<string>('')

  useEffect(() => {
    listAllMenus()
      .then(res => setMenus(res.data.data.filter(m => m.isAvailable)))
      .catch(() => alert('메뉴 정보를 불러오는 데 실패했습니다.'))
  }, [])

  const filtered = menus.filter(m => m.category === tab)

  const add = (id: number) => {
    setCart(c => {
      const next = { ...c, [id]: (c[id] || 0) + 1 }
      // show toast
      setToast('장바구니에 저장되었습니다.')
      setTimeout(() => setToast(''), 2000)
      return next
    })
  }
  const remove = (id: number) =>
    setCart(c => {
      const nextCount = (c[id] || 0) - 1
      if (nextCount <= 0) {
        const { [id]:_, ...rest } = c
        return rest
      }
      return { ...c, [id]: nextCount }
    })

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

      {/* 리스트 */}
      <div className="flex-1 overflow-auto px-4 py-2 pb-32 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            해당 카테고리에 메뉴가 없습니다.
          </p>
        ) : filtered.map(menu => (
          <div
            key={menu.id}
            className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
          >
            {/* 상세로 이동 */}
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

            {/* 수량 & 담기 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={e => { e.stopPropagation(); remove(menu.id) }}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-lg hover:bg-gray-100 transition"
              >－</button>
              <span className="w-6 text-center">{cart[menu.id] || 0}</span>
              <button
                onClick={e => { e.stopPropagation(); add(menu.id) }}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-lg hover:bg-gray-100 transition"
              >＋</button>
              <button
                onClick={e => { e.stopPropagation(); add(menu.id) }}
                className="ml-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 내비 */}
      <div className="fixed bottom-0 left-0 w-full bg-green-50 px-4 py-4 flex items-center justify-between z-10">
        <button
          onClick={() => nav(-1)}
          className="bg-red-400 text-white px-5 py-3 rounded-full font-bold"
        >
          이전화면 가기
        </button>

        {/* 토스트 메시지 */}
        {toast && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg">
            {toast}
          </div>
        )}

        <button
          onClick={goCart}
          className="bg-green-600 text-white px-5 py-3 rounded-full font-bold relative"
        >
          장바구니 보기
          {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 text-center rounded-full text-sm">
              {Object.values(cart).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
      </div>
    </div>
)
}

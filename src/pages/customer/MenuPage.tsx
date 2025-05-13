import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listMenus } from '../../api'
import type { MenuDTO } from '../../api'

export default function MenuPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const nav = useNavigate()
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [cart, setCart] = useState<Record<number, number>>({})

  useEffect(() => {
    listMenus()
     .then(res =>
       // 품절된(isAvailable === false) 메뉴는 제외
       setMenus(res.data.data.filter(menu => menu.isAvailable))
     )
      .catch(() => {
        alert('메뉴 정보를 불러오는 데 실패했습니다.')
      })
  }, [])

  const add = (id: number) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  }
  const remove = (id: number) => {
    setCart(c => {
      const n = (c[id] || 0) - 1
      if (n <= 0) {
        const { [id]: _, ...rest } = c
        return rest
      }
      return { ...c, [id]: n }
    })
  }

  return (
    <div className="w-full h-screen bg-white p-4 flex flex-col">
      {/* 헤더 */}
      <header className="text-center font-bold mb-4">
        아주대학교 경영인텔리전스학과 주점
      </header>

      {/* 메뉴 리스트 */}
      <div className="flex-1 overflow-auto space-y-4">
        {menus
        .filter(menu => menu.isAvailable)
        .map(menu => (
          <div key={menu.id} className="flex items-center">
            <img
              src={menu.imageUrl ?? ''}
              alt={menu.name}
              className="w-16 h-16 rounded mr-3 object-cover"
            />
            <div className="flex-1">
              <div className="font-medium">{menu.name}</div>
              <div className="text-sm text-gray-600 mt-1">{menu.description}</div>
              <div className="text-sm text-gray-600">
                {menu.price.toLocaleString()}원
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => remove(menu.id)}
                className="px-2 py-1 border rounded"
              >
                －
              </button>
              <span>{cart[menu.id] || 0}</span>
              <button
                onClick={() => add(menu.id)}
                className="px-2 py-1 border rounded"
              >
                ＋
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 네비게이션 */}
      <nav className="flex justify-between mt-4">
        <button
          onClick={() => nav(-1)}
          className="py-2 px-4 text-gray-700"
        >
          ← 이전 화면
        </button>
        <button
          onClick={() =>
            nav(`/customer/${tableNumber}/summary`, { state: { cart } })
          }
          className="py-2 px-4 bg-green-600 text-white rounded"
        >
          장바구니 →
        </button>
      </nav>
    </div>
  )
}

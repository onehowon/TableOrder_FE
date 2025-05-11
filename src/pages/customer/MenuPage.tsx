// src/pages/customer/MenuPage.tsx
import { useEffect, useState } from 'react'
import { fetchCustomerMenus, MenuDTO } from '@/api/customer'
import { useCart } from '@/contexts/CartContext'

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    fetchCustomerMenus()
      .then(res => {
        console.log('🔍 customer menus:', res.data.data)
        setMenus(res.data.data ?? [])  // undefined 대비
      })
      .catch(err => {
        console.error('메뉴 불러오기 실패', err)
      })
  }, [])

  if (menus.length === 0) {
    return <p className="p-4">메뉴가 없습니다.</p>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">메뉴</h1>
      <ul className="grid grid-cols-2 gap-4">
        {menus.map(m => (
          <li key={m.id} className="bg-white rounded shadow p-2">
            <h2 className="font-semibold">{m.name}</h2>
            <p className="text-sm text-gray-600">{m.description}</p>
            <div className="mt-2 flex justify-between items-center">
            + <span>
                {m.price != null
                    ? m.price.toLocaleString() + '원'
                    : '-'}
                </span>
              <button
                onClick={() => addItem({ menuId: m.id, name: m.name, price: m.price })}
                className="btn-primary btn-xs"
              >
                담기
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getCustomerMenus } from '../api'
import { useCart }          from '../contexts/CartContext'
import PageWrapper         from '../components/PageWrapper'

interface MenuDTO {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
}

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const { addItem }       = useCart()
  const [qty, setQty]     = useState<Record<number, number>>({})

  useEffect(() => {
    getCustomerMenus().then(r => setMenus(r.data.data))
  }, [])

  return (
    <PageWrapper title="메뉴">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map(m => (
          <div key={m.id} className="bg-zinc-800 rounded-xl p-4 flex flex-col">
            {m.imageUrl && (
              <img
                src={m.imageUrl}
                alt={m.name}
                className="rounded-lg aspect-square object-cover mb-3"
              />
            )}
            <h3 className="font-semibold text-lg">{m.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-2">{m.description}</p>
            <b className="mb-3">{m.price.toLocaleString()}원</b>
            <div className="mt-auto flex gap-2">
              <input
                type="number"
                min={1}
                value={qty[m.id] ?? 1}
                onChange={e =>
                  setQty(q => ({ ...q, [m.id]: +e.target.value || 1 }))
                }
                className="w-16 bg-zinc-900 border border-zinc-700 rounded text-center"
              />
              <button
                onClick={() =>
                  addItem({ menuId: m.id, name: m.name, price: m.price }, qty[m.id] ?? 1)
                }
                className="flex-1 btn-primary"
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}

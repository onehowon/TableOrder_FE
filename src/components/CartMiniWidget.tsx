// src/components/CartMiniWidget.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { MenuDTO } from '@/api'

interface Props {
  cart: Record<number, number>
  menus: MenuDTO[]
  tableNumber: string
}

export default function CartMiniWidget({ cart, menus, tableNumber }: Props) {
  const navigate = useNavigate()

  // cart에 담긴 메뉴 아이디와 수량을 뽑아서, 메뉴 정보와 매칭
  const items = Object.entries(cart)
    .map(([id, qty]) => {
      const menu = menus.find(m => m.id === Number(id))
      return menu ? { ...menu, quantity: qty } : null
    })
    .filter((x): x is MenuDTO & { quantity: number } => x !== null)

  if (items.length === 0) return null

  const total = items.reduce((sum, m) => sum + m.price * m.quantity, 0)

  return (
    <div
      className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-64"
      onClick={() => navigate(`/customer/${tableNumber}/summary`, { state: { cart } })}
    >
      <h2 className="text-lg font-semibold mb-2">장바구니</h2>
      <ul className="divide-y">
        {items.map((m, i) => (
          <li key={i} className="py-1 flex justify-between">
            <span className="truncate mr-2">{m.name} × {m.quantity}</span>
            <span className="font-medium">{(m.price * m.quantity).toLocaleString()}원</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t pt-2 flex justify-between font-bold">
        <span>총 합계</span>
        <span>{total.toLocaleString()}원</span>
      </div>
    </div>
  )
}

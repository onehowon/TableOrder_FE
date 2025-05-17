// src/contexts/CartContext.tsx
import React, { createContext, useState, ReactNode } from 'react'

type Cart = Record<number, number>
interface CartContextType {
  cart: Cart
  addToCart: (id: number, qty?: number) => void
  removeFromCart: (id: number) => void
}

export const CartContext = createContext<CartContextType>({
  cart: {},
  addToCart: () => {},
  removeFromCart: () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({})

  const addToCart = (id: number, qty: number = 1) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + qty }))
  }
  const removeFromCart = (id: number) => {
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

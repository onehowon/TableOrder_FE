import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,      // ← 타입 전용 import
} from 'react'

/* ─────────────────── 타입 ─────────────────── */
export interface CartItem {
  menuId: number
  name: string
  price: number
  quantity: number
}

interface CartCtx {
  cart: CartItem[]
  addItem:       (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  decrement:     (menuId: number, qty?: number) => void
  remove:        (menuId: number) => void
  clear:         () => void
  /** `clear()` 의 별칭. 기존 코드 호환용 */
  clearCart:     () => void
}

/* ─────────────────── 컨텍스트 ─────────────────── */
const CartContext = createContext<CartCtx | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  /* 로컬 저장소 동기화 */
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])

  /* CRUD helpers */
  const addItem = (data: Omit<CartItem, 'quantity'>, qty = 1) =>
    setCart(prev => {
      const inCart = prev.find(i => i.menuId === data.menuId)
      return inCart
        ? prev.map(i =>
            i.menuId === data.menuId ? { ...i, quantity: i.quantity + qty } : i
          )
        : [...prev, { ...data, quantity: qty }]
    })

  const decrement = (menuId: number, qty = 1) =>
    setCart(prev =>
      prev
        .map(i =>
          i.menuId === menuId ? { ...i, quantity: i.quantity - qty } : i
        )
        .filter(i => i.quantity > 0)
    )

  const remove = (menuId: number) =>
    setCart(prev => prev.filter(i => i.menuId !== menuId))

  const clear = () => setCart([])

  /* 값을 한 번에 제공 */
  const value: CartCtx = {
    cart,
    addItem,
    decrement,
    remove,
    clear,
    clearCart: clear, // ← 별칭
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/* 사용 훅 */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

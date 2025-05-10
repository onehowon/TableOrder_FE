import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useTable } from './TableContext'

export interface CartItem {
  menuId: number
  name:    string
  price:   number
  quantity:number
}

interface CartCtx {
  cart: CartItem[]
  addItem     (item: Omit<CartItem,'quantity'>, qty?: number): void
  decrement   (menuId:number, qty?:number): void
  remove      (menuId:number): void
  clear       (): void
  clearCart   (): void          // alias (기존 호환)
}

const CartContext = createContext<CartCtx|undefined>(undefined)

/* ────────────────────────── Provider ────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const { tableId } = useTable()

  /** key = table‑{id} (테이블별 개별 저장) */
  const storageKey  = tableId ? `cart-table-${tableId}` : 'cart-temp'

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  /* 테이블이 바뀌면 해당 테이블의 장바구니를 불러옴 */
  useEffect(() => {
    const saved = tableId ? localStorage.getItem(storageKey) : '[]'
    setCart(saved ? JSON.parse(saved) : [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId])

  /* 항상 자신의 key 에 저장 */
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart))
  }, [cart, storageKey])

  /* helper ============================= */
  const addItem   = (d:Omit<CartItem,'quantity'>, q=1)=>setCart(p=>{
    const ex=p.find(i=>i.menuId===d.menuId)
    return ex
      ? p.map(i=>i.menuId===d.menuId ? {...i,quantity:i.quantity+q}:i)
      : [...p,{...d,quantity:q}]
  })
  const decrement = (id:number,q=1)=>setCart(p=>
    p.map(i=>i.menuId===id?{...i,quantity:i.quantity-q}:i)
     .filter(i=>i.quantity>0))
  const remove    = (id:number)=>setCart(p=>p.filter(i=>i.menuId!==id))
  const clear     = ()=>setCart([])

  const value:CartCtx={cart,addItem,decrement,remove,clear,clearCart:clear}
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(){
  const ctx=useContext(CartContext)
  if(!ctx) throw new Error('useCart outside provider')
  return ctx
}

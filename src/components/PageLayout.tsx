import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from '../contexts/TableContext';
import CartMiniWidget from './CartMiniWidget'

interface Props { children: ReactNode; isAdmin?: boolean }

export default function PageLayout({ children, isAdmin = false }: Props) {
  const nav = useNavigate()
  const { tableId } = useTable()
  const { pathname } = useLocation()

  const goHome = () => {
    if (isAdmin) return nav('/admin')
    return tableId ? nav('/welcome') : nav('/')
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="flex items-center gap-2 p-4 bg-zinc-800">
        {pathname !== '/' && <button onClick={() => nav(-1)} className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600">← 뒤로</button>}
        <button onClick={goHome} className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600">홈</button>
      </header>

      <main className="flex-1 p-4">{children}</main>

      {/* 고객용 화면일 때만 항상 장바구니 보이도록 */}
      {!isAdmin && <CartMiniWidget />}
    </div>
  )
}
// src/components/SideNav.tsx
import { NavLink } from 'react-router-dom'

export default function SideNav() {
  return (
    <nav className="space-y-2">
      <NavLink
        to="/admin/alerts"
        className={({ isActive }) =>
          `block px-4 py-2 rounded ${isActive ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`
        }
      >
        주문 알림
      </NavLink>
      <NavLink to="/admin/orders" className="block px-4 py-2 rounded hover:bg-blue-50">
        주문 리스트
      </NavLink>
      <NavLink to="/admin/tables" className="block px-4 py-2 rounded hover:bg-blue-50">
        테이블 번호
      </NavLink>
      <NavLink to="/admin/stats" className="block px-4 py-2 rounded hover:bg-blue-50">
        매출
      </NavLink>
    </nav>
  )
}

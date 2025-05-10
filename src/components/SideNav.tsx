// src/components/SideNav.tsx
import { NavLink } from 'react-router-dom'

export default function SideNav() {
  const base   = 'block flex items-center px-4 py-3 rounded transition'
  const active = 'bg-blue-100 font-semibold text-blue-800'
  const hover  = 'hover:bg-blue-50 text-gray-700'

  return (
    <nav className="w-[200px] bg-white border-r shadow-sm flex-shrink-0">
      <ul className="space-y-1">
        <li>
          <NavLink
            to="/admin/alerts"
            className={({ isActive }) =>
              `${base} ${isActive ? active : hover}`
            }
          >
            📢 주문 알림
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${base} ${isActive ? active : hover}`
            }
          >
            📋 주문 리스트
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/tables"
            className={({ isActive }) =>
              `${base} ${isActive ? active : hover}`
            }
          >
            🔢 테이블 번호
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/sales"
            className={({ isActive }) =>
              `${base} ${isActive ? active : hover}`
            }
          >
            💰 매출
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

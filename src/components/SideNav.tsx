// src/components/SideNav.tsx
import { NavLink } from 'react-router-dom'
import {
  HiOutlineBell,
  HiOutlineListBullet,
  HiOutlineTableCells,
  HiOutlineChartBar,
  HiOutlineSquares2X2
} from 'react-icons/hi2'

const menus = [
  { to: '/admin/boards',   icon: <HiOutlineTableCells />,  label: '주문 현황'   },
  { to: '/admin/orders',   icon: <HiOutlineListBullet />, label: '주문 리스트' },
  { to: '/admin/requests', icon: <HiOutlineSquares2X2 />, label: '직원 호출'   },
  { to: '/admin/sales',    icon: <HiOutlineChartBar />,    label: '매출'       },
  { to: '/admin/menus',    icon: <HiOutlineSquares2X2 />, label: '메뉴 관리'   },
]

export default function SideNav() {
  return (
    <aside className="w-60 bg-white shadow-sm flex-shrink-0">
      <nav className="mt-6 flex flex-col space-y-2">
        {menus.map(m => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-r-lg transition ${
                isActive ? 'bg-blue-500 text-white' : ''
              }`
            }
          >
            <span className="text-lg mr-3">{m.icon}</span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

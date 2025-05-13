import { NavLink } from 'react-router-dom'
import {
  HiOutlineBell,
  HiOutlineListBullet,
  HiOutlineChartBar,
  HiOutlineSquares2X2,
  HiOutlineTableCells
} from 'react-icons/hi2'
import { useContext } from 'react'
import { UnreadRequestsContext } from './layout/AdminLayout'

const menus = [
  { to: '/admin/boards',   icon: <HiOutlineSquares2X2 />, label: '주문 현황' },
  { to: '/admin/orders',   icon: <HiOutlineListBullet />, label: '주문 리스트' },
  { to: '/admin/requests', icon: <HiOutlineBell />,        label: '직원 호출' },
  { to: '/admin/sales',    icon: <HiOutlineChartBar />,    label: '매출' },
  { to: '/admin/menus',    icon: <HiOutlineTableCells />,  label: '메뉴 관리' },
]

export default function SideNav() {
  const { unread } = useContext(UnreadRequestsContext)

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
            {m.to === '/admin/requests' && unread > 0 && (
              <span className="ml-auto inline-block bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
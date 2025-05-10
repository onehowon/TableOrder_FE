import { NavLink } from 'react-router-dom'
import { Gift, List, Grid, BarChart2 } from 'lucide-react'

const items = [
  { to: '/admin/alerts',    label: '주문 알림', icon: Gift },
  { to: '/admin/orders',    label: '주문 리스트', icon: List },
  { to: '/admin/tables',    label: '테이블 번호', icon: Grid },
  { to: '/admin/stats',     label: '매출',        icon: BarChart2 },
]

export default function SideNav() {
  return (
    <aside className="w-56 bg-white border-r flex-shrink-0">
      <div className="px-6 py-8 text-xl font-bold text-blue-600">admin page</div>
      <nav className="space-y-1 px-2">
        {items.map(({to,label,icon:Icon}) => (
          <NavLink
            key={to}
            to={to}
            className={({isActive}) =>
              `flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100
               ${isActive ? 'bg-gray-100 font-medium' : ''}`
            }
          >
            <Icon className="mr-3" size={18}/>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

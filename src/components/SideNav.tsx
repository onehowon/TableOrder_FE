// src/components/SideNav.tsx
import { NavLink } from 'react-router-dom'
import { listRequestsAdmin } from '@/api'
import { useEffect, useState } from 'react'
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
  const [reqCount, setReqCount] = useState(0)

  useEffect(() => {
    let mounted = true
    const fetchReqs = async () => {
      try {
        const res = await listRequestsAdmin()
        if (!mounted) return
        setReqCount(res.data.data.length)
      } catch (err) {
        console.error('직원 호출 수 조회 실패', err)
      }
    }
    fetchReqs()
    const iv = setInterval(fetchReqs, 5000)
    return () => {
      mounted = false
      clearInterval(iv)
    }
  }, [])

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
            <div className="relative">
              <span className="text-lg mr-3">{m.icon}</span>
              {m.to === '/admin/requests' && reqCount > 0 && (
                <span
                  className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"
                  aria-label={`${reqCount}개의 새 호출`}
                />
              )}
            </div>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
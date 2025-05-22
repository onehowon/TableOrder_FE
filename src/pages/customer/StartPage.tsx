// src/pages/admin/StatsPage.tsx
import { useEffect, useState } from 'react'
import { getSalesStatsAdmin } from '@/api'
import type { SalesStatsDTO } from '@/api'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from 'recharts'

export default function StatsPage() {
  const [stats, setStats] = useState<SalesStatsDTO | null>(null)

  useEffect(() => {
    getSalesStatsAdmin()
      .then(r => setStats(r.data.data))
      .catch(() => alert('통계 정보를 불러오는 데 실패했습니다.'))
  }, [])

  if (!stats) return <p>Loading…</p>

  // 1) 매출
  const totalRevenue = stats.totalRevenue ?? 0

  // 2) 메뉴별 이윤 데이터
  const menuData = (stats.salesByMenu ?? []).map(m => ({
    name: m.menuName,
    profit: m.profit ?? 0,
  }))

  // 3) 이윤: 백엔드 totalProfit 이 있으면 쓰고, 없으면 menuData 합계
  const totalProfit = 
    stats.totalProfit != null
      ? stats.totalProfit
      : menuData.reduce((sum, m) => sum + m.profit, 0)

  // 시간대별 매출
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}시`,
    revenue: stats.salesByHour.find(p => p.hour === h)?.revenue || 0,
  }))

  return (
    <div className="p-6 space-y-6">
      {/* 상단 카드 */}
      <div className="flex space-x-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">총 주문수</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">매출</p>
          <p className="text-2xl font-bold">
            {totalRevenue.toLocaleString()}원
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">이윤</p>
          <p className="text-2xl font-bold">
            {totalProfit.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 시간대별 매출 (LineChart) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-2 text-lg font-semibold">시간대별 매출</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip formatter={val => `${(+val).toLocaleString()}원`} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4ade80"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 메뉴별 이윤 (BarChart) */}
      {menuData.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="mb-2 text-lg font-semibold">메뉴별 이윤</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={menuData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={val => `${(+val).toLocaleString()}원`} />
              <Legend />
              <Bar dataKey="profit" fill="#22c55e" name="이윤" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

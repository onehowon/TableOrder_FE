// src/pages/admin/StatsPage.tsx
import { useEffect, useState } from 'react'
import { getSalesStats, } from '@/api'
import type { SalesStatsDTO } from '@/api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function StatsPage() {
  const [stats, setStats] = useState<SalesStatsDTO | null>(null)

  useEffect(() => {
    getSalesStats().then((res) => setStats(res.data.data))
  }, [])

  if (!stats) {
    return <p className="p-4">로딩 중…</p>
  }

  // 차트용 데이터 변환
  const data = Object.entries(stats.salesByHour).map(([hour, amount]) => ({
    hour: `${hour}시`,
    amount,
  }))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">매출</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">총 고객수</p>
          <p className="text-2xl font-semibold">
            {stats.totalCustomers.toLocaleString()}명
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">총 주문수</p>
          <p className="text-2xl font-semibold">
            {stats.totalOrders.toLocaleString()}건
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">총 매출 금액</p>
          <p className="text-2xl font-semibold">
            {stats.totalSales.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <p className="text-gray-500 mb-2">시간대별 매출</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="hour" />
            <YAxis
              tickFormatter={(val) => `${Math.round(val / 10000)}만`}
            />
            <Tooltip
              formatter={(val: number) => `${val.toLocaleString()}원`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

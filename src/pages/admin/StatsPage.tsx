import { useEffect, useState } from 'react'
import { getSalesStatsAdmin } from '@/api'
import type { SalesStatsDTO } from '@/api'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function StatsPage() {
  const [stats, setStats] = useState<SalesStatsDTO|null>(null)
  useEffect(() => { getSalesStatsAdmin().then(r => setStats(r.data.data)) }, [])
  if (!stats) return <p>Loading…</p>

  const data = Array.from({length:24},(_,h)=>({
    hour:`${h}시`, revenue: stats.salesByHour.find(p=>p.hour===h)?.revenue||0
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4">
        <div className="p-4 bg-white rounded shadow"><p>총 주문수</p><p className="text-xl">{stats.totalOrders}</p></div>
        <div className="p-4 bg-white rounded shadow"><p>매출</p><p className="text-xl">{stats.totalRevenue.toLocaleString()}원</p></div>
        <div className="p-4 bg-white rounded shadow"><p>이윤</p><p className="text-xl">{(stats.totalRevenue - stats.totalCustomers*0 /* replace cost */).toLocaleString()}원</p></div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip formatter={(v)=>`${v.toLocaleString()}원`} />
            <Line type="monotone" dataKey="revenue" dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
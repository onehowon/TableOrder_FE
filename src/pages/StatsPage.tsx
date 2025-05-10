import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { User, Box, TrendingUp } from 'lucide-react'
import api from '../api'

interface StatData { time: string; amount: number }

export default function StatsPage() {
  const [totalCustomers, setCustomers] = useState(0)
  const [totalOrders,    setOrders]    = useState(0)
  const [totalSales,     setSales]     = useState(0)
  const [chartData,      setChartData] = useState<StatData[]>([])

  useEffect(() => {
    api.get('/admin/orders/today-summary').then(r => {
      const d = r.data.data
      setCustomers(d.totalCustomers)
      setOrders(d.totalOrders)
      setSales(d.totalSales)
    })
    api.get('/admin/stats/chart').then(r => setChartData(r.data.data))
  }, [])

  const InfoCard = ({ title, value, icon: Icon }: any) => (
    <div className="flex-1 bg-white rounded-2xl shadow p-6 flex items-center">
      <div className="p-3 bg-gray-100 rounded-full mr-4"><Icon size={24}/></div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">수익</h2>
      <div className="flex gap-6 mb-8">
        <InfoCard title="총 고객수"   value={`${totalCustomers}명`} icon={User} />
        <InfoCard title="총 주문수"   value={`${totalOrders}건`}   icon={Box}  />
        <InfoCard title="총 판매 금액" value={`${totalSales.toLocaleString()}원`} icon={TrendingUp} />
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-lg font-medium">수익 추이</div>
          <select className="border px-3 py-1 rounded">
            <option>첫째날</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={{fontSize:12}}/>
            <YAxis tickFormatter={v=>`${(v/10000).toFixed(0)}만 원`} tick={{fontSize:12}}/>
            <Tooltip formatter={(v:number)=>`${v.toLocaleString()}원`}/>
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{r:4}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// src/pages/admin/StatsPage.tsx
import { useEffect, useState, ChangeEvent } from 'react'
import { getSalesStatsAdmin, listOrdersAdmin, listAdminMenus } from '@/api'
import type { SalesStatsDTO, OrderDetailDTO, MenuDTO } from '@/api'
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
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function StatsPage() {
  const [stats, setStats]   = useState<SalesStatsDTO | null>(null)
  const [orders, setOrders] = useState<OrderDetailDTO[]>([])
  const [priceMap, setPriceMap] = useState<Record<string, number>>({})

  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate]     = useState<string>('')

  // 1) 통계 데이터 로드
  useEffect(() => {
    getSalesStatsAdmin()
      .then(r => setStats(r.data.data))
      .catch(() => alert('통계 정보를 불러오는 데 실패했습니다.'))
  }, [])

  // 2) 주문 데이터 로드
  useEffect(() => {
    listOrdersAdmin()
      .then(r => setOrders(r.data.data))
      .catch(() => alert('주문 정보를 불러오는 데 실패했습니다.'))
  }, [])

  // 3) 관리자 메뉴에서 가격 매핑(name → price)
  useEffect(() => {
    listAdminMenus()
      .then(r => {
        const map: Record<string, number> = {}
        r.data.data.forEach((m: MenuDTO) => {
          map[m.name] = m.price
        })
        setPriceMap(map)
      })
      .catch(() => alert('메뉴 정보를 불러오는 데 실패했습니다.'))
  }, [])

  if (!stats) return <p>Loading…</p>

  // 기본값 처리
  const totalRevenue = stats.totalRevenue ?? 0
  const totalProfit  = stats.totalProfit  ?? 0

  // 시간대별 매출(0~23시)
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}시`,
    revenue: stats.salesByHour.find(p => p.hour === h)?.revenue || 0,
  }))

  // 메뉴별 이윤
  const menuData = (stats.salesByMenu ?? []).map(m => ({
    name: m.menuName,
    profit: m.profit ?? 0,
  }))

  // 날짜 범위 필터링된 주문
  const filteredOrders = orders.filter(o => {
    if (!fromDate || !toDate) return true
    const d = o.createdAt.slice(0,10) // "YYYY-MM-DD"
    return d >= fromDate && d <= toDate
  })

  // 엑셀 다운로드
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()

    // 시트1: 메뉴별 이윤
    const wsMenu = XLSX.utils.json_to_sheet(menuData)
    XLSX.utils.book_append_sheet(wb, wsMenu, '메뉴별 이윤')

    // 시트2: 주문 상세 (아이템별로 분리)
    const orderRows: Record<string, string|number>[] = []
    filteredOrders.forEach(o => {
      const timestamp = new Date(o.createdAt).toLocaleString('ko-KR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
      o.items.forEach(i => {
        const unitPrice = priceMap[i.name] || 0
        orderRows.push({
          시각: timestamp,
          테이블: o.tableNumber,
          메뉴명: i.name,
          수량: i.quantity,
          단가: unitPrice,
          금액: unitPrice * i.quantity,
        })
      })
    })
    const wsOrder = XLSX.utils.json_to_sheet(orderRows, {
      header: ['시각','테이블','메뉴명','수량','단가','금액']
    })
    XLSX.utils.book_append_sheet(wb, wsOrder, '주문 상세')

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `report_${fromDate || 'all'}_to_${toDate || 'all'}.xlsx`
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 날짜 선택 & 다운로드 */}
      <div className="flex items-end justify-end space-x-2">
        <div>
          <label className="block text-sm text-gray-600">시작일</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">종료일</label>
          <input
            type="date"
            value={toDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          보고서 다운로드
        </button>
      </div>

      {/* 상단 카드 */}
      <div className="flex space-x-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">총 주문수</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">매출</p>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}원</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">이윤</p>
          <p className="text-2xl font-bold">{totalProfit.toLocaleString()}원</p>
        </div>
      </div>

      {/* 시간대별 매출(LineChart) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-2 text-lg font-semibold">시간대별 매출</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip formatter={v => `${(+v).toLocaleString()}원`} />
            <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 메뉴별 이윤(BarChart) */}
      {menuData.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="mb-2 text-lg font-semibold">메뉴별 이윤</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={menuData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={v => `${(+v).toLocaleString()}원`} />
              <Legend />
              <Bar dataKey="profit" fill="#22c55e" name="이윤" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

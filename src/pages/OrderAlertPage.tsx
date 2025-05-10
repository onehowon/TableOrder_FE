// src/pages/OrderAlertPage.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { OrderAlertDTO } from '../types'

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<OrderAlertDTO[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get<{ data: OrderAlertDTO[] }>('/admin/alerts')
        setAlerts(res.data.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
    const iv = setInterval(fetch, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex">
      {/* 사이드바 생략 */}
      <div className="p-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">주문 알림</h1>
        <ul className="space-y-4">
          {alerts.map((a,i) => (
            <li key={i} className="bg-gray-100 p-4 rounded-lg flex justify-between">
              <div>
                <strong>{a.tableNumber}번 테이블</strong> 에서 {a.items.map(x=>`${x.menuName} ${x.quantity}개`).join(', ')} 주문
              </div>
              <div className="text-sm text-gray-500">
                {new Date(a.createdAt).toLocaleTimeString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

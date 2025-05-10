import { useEffect, useState } from 'react'
import api from '../api'

interface Alert {
  id: number
  message: string
  time: string
}

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    api.get<{ data: Alert[] }>('/admin/alerts')
      .then(res => setAlerts(res.data.data))
  }, [])

  return (
    <div className="flex h-full">
      {/* 좌측 메뉴 */}
      <aside className="w-80 bg-white rounded-2xl shadow p-6 mr-6 flex-shrink-0">
        <button className="w-full bg-blue-500 text-white py-2 rounded mb-6">Table order</button>
        <ul className="space-y-3">
          {['주문','추가','삭제','수정'].map(label=>(
            <li key={label}>
              <button className="w-full text-left px-4 py-3 bg-blue-50 rounded">{label}</button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 우측 채팅 */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">주문 알림</h2>
        <div className="space-y-6">
          {alerts.map(a => (
            <div key={a.id} className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
              <div className="relative bg-gray-100 p-4 rounded-xl flex-1">
                <p className="text-gray-800">{a.message}</p>
                <span className="absolute bottom-2 right-3 text-xs text-gray-500">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

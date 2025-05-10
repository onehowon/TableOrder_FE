// src/pages/OrderAlertPage.tsx
import React, { useEffect, useState } from 'react'
import api from '../api'
import type { OrderAlertDTO } from '../types'

export default function OrderAlertPage() {
  // ① alerts 상태 선언
  const [alerts, setAlerts] = useState<OrderAlertDTO[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<{ data: OrderAlertDTO[] }>('/admin/alerts')
        setAlerts(res.data.data)
      } catch (err) {
        console.error('OrderAlertPage 오류:', err)
      }
    }

    fetchAlerts()
    const iv = setInterval(fetchAlerts, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 생략 */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">주문 알림</h1>
        <div className="space-y-6">
          {/* ② i에 타입 명시 */}
          {alerts.map((a, i: number) => (
            <div key={i} className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
              <div className="relative bg-gray-100 p-4 rounded-xl flex-1">
                <p className="text-gray-800">
                  <strong>{a.tableNumber}번 테이블</strong>에서{' '}
                  {a.items.map(x => `${x.menuName} ${x.quantity}개`).join(', ')} 주문하셨습니다.
                </p>
                <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-gray-500">현재 새로운 주문이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  )
}

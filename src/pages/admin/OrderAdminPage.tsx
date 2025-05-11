// src/pages/admin/OrderAlertPage.tsx
import { useEffect, useState } from 'react'
import { getAlerts, OrderAlertDTO } from '@/api'

export default function OrderAlertPage() {
  const [alerts, setAlerts] = useState<OrderAlertDTO[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await getAlerts()
      setAlerts(Array.isArray(res.data.data) ? res.data.data : [])
    }
    load()
    const iv = setInterval(load, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <ul>
      {alerts.map((a,i) => (
        <li key={i}>
          <p>
            <strong>{a.tableNumber}번 테이블</strong>:
            {a.items.map(x => `${x.menuName} ${x.quantity}개`).join(', ')}
          </p>
          <p>
            {new Date(a.createdAt).toLocaleTimeString()}
          </p>
        </li>
      ))}
    </ul>
  )
}

// src/pages/OrderStatusPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

interface Item {
  name: string
  quantity: number
}

interface Status {
  status: string
  estimatedTime?: number    // 남은 예상 시간(분) – 없으면 undefined
  items: Item[]
}

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()           // URL 파라미터
  const [data, setData]     = useState<Status | null>(null)      // 주문 상태 전체
  const [remain, setRemain] = useState<number | null>(null)      // 남은 시간(분)

  /* ─────────────────────────────
     1) 5초마다 주문 상태 폴링
  ──────────────────────────────*/
  useEffect(() => {
    // setInterval 반환값 타입(Node·브라우저 모두 호환)
    let iv: ReturnType<typeof setInterval> | undefined

    // 주문 상태 요청 함수
    const fetchStatus = () =>
      api.get(`/customer/orders/${orderId}`)
         .then(res => {
           const d = res.data.data as Status
           setData(d)
           setRemain(d.estimatedTime ?? null)
         })
         .catch(console.error)

    if (orderId) {
      fetchStatus()                    // 최초 1회
      iv = setInterval(fetchStatus, 5000)  // 이후 5초 간격
    }

    // cleanup – 정리 함수는 void만 반환
    return () => {
      if (iv) clearInterval(iv)
    }
  }, [orderId])

  /* ─────────────────────────────
     2) 남은 분(minute) 카운트다운
  ──────────────────────────────*/
  useEffect(() => {
    if (remain !== null && remain > 0) {
      const to = setTimeout(() => setRemain(r => (r !== null ? r - 1 : null)), 60000)
      return () => clearTimeout(to)
    }
  }, [remain])

  /* ─────────────────────────────
     3) 렌더링
  ──────────────────────────────*/
  if (!data) return <p style={{ textAlign: 'center', marginTop: 40 }}>로딩 중…</p>

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">주문 상태</h2>

      <p className="mb-2">
        상태: <strong>{data.status}</strong>
      </p>

      {remain !== null && (
        <p className="mb-4">
          남은 시간: <strong>{remain}분</strong>
        </p>
      )}

      <ul className="list-disc pl-5">
        {data.items.map((item, idx) => (
          <li key={idx}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}

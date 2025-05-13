// src/pages/admin/RequestAlertPage.tsx
import { useEffect, useState } from 'react'
import type { CustomerRequestDTO } from '@/api'
import { listRequestsAdmin } from '@/api'

export default function RequestAlertPage() {
  const [reqs, setReqs]     = useState<CustomerRequestDTO[]>([])
  const [readIds, setReadIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('readRequests')
    return stored ? JSON.parse(stored) : []
  })

  const fetchReqs = async () => {
    try {
      const res = await listRequestsAdmin()   // 이제 /alerts 로 가져와야겠죠
      setReqs(res.data.data)
    } catch (err) {
      console.error('요청 알림 조회 실패', err)
    }
  }

  useEffect(() => {
    fetchReqs()
    const iv = setInterval(fetchReqs, 5000)
    return () => clearInterval(iv)
  }, [])

  const handleProcess = (id: number) => {
    // 1) 로컬에 읽음 처리
    setReadIds(prev => {
      const next = [...prev, id]
      localStorage.setItem('readRequests', JSON.stringify(next))
      return next
    })
    // 2) UI 에서만 사라지도록 필터링
    setReqs(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">직원 호출 알림</h2>

      {reqs.length === 0 ? (
        <p className="text-gray-500">현재 알림이 없습니다.</p>
      ) : (
        reqs.map(r => (
          <div
            key={r.id}
            className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow"
          >
            <span>
              {new Date(r.createdAt)
                .toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              {' '}
              {r.tableNumber}번 테이블 호출
            </span>
            <button
              onClick={() => handleProcess(r.id)}
              className="px-3 py-1 bg-red-400 text-white hover:bg-red-500 rounded"
            >
              처리
            </button>
          </div>
        ))
      )}
    </div>
  )
}

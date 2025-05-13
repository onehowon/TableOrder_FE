import { useEffect, useState } from 'react'
import type { CustomerRequestDTO } from '@/api'
import { listRequestsAdmin, deleteRequest } from '@/api'

export default function RequestAlertPage() {
  const [reqs, setReqs] = useState<CustomerRequestDTO[]>([])
  const [readIds, setReadIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('readRequests')
    return stored ? JSON.parse(stored) : []
  })

  const fetchReqs = async () => {
    try {
      const res = await listRequestsAdmin()
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

  const handleProcess = async (id: number) => {
    try {
      await deleteRequest(id) // ✅ id 값 확실히 있음
      setReqs(prev => prev.filter(r => r.id !== id)) // 삭제 후 리스트 갱신
    } catch (err) {
      console.error('직원 호출 처리 실패', err)
      alert('처리 중 오류가 발생했습니다.')
    }
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

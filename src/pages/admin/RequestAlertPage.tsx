// src/pages/admin/RequestAlertPage.tsx
import { useEffect, useState } from 'react'
import { listRequestsAdmin, deleteRequest } from '@/api'
import type { CustomerRequestDTO } from '@/api'

export default function RequestAlertPage() {
  const [reqs, setReqs] = useState<CustomerRequestDTO[]>([])
  // localStorage 에서 읽음 처리된 ID 목록을 불러옵니다.
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
    // 서버에 처리(삭제) 요청
    await deleteRequest(id)
    // 로컬에도 읽음 표시
    setReadIds(prev => {
      const next = [...prev, id]
      localStorage.setItem('readRequests', JSON.stringify(next))
      return next
    })
    // 목록 갱신
    fetchReqs()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">직원 호출 알림</h2>

      {reqs.length === 0 ? (
        <p className="text-gray-500">현재 알림이 없습니다.</p>
      ) : (
        reqs.map(r => {
          const isRead = readIds.includes(r.id)
          return (
            <div
              key={r.id}
              className={`
                flex justify-between items-center 
                bg-white p-4 mb-2 rounded shadow
                ${isRead ? 'opacity-50' : ''}
              `}
            >
              <span>
                {new Date(r.createdAt)
                  .toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                {' '}
                {r.tableNumber}번 테이블 호출
              </span>
              <button
                onClick={() => handleProcess(r.id)}
                disabled={isRead}
                className={`
                  px-3 py-1 rounded text-sm
                  ${isRead 
                    ? 'bg-gray-300 text-gray-600 cursor-default' 
                    : 'bg-red-400 text-white hover:bg-red-500'}
                `}
              >
                {isRead ? '처리됨' : '처리'}
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}

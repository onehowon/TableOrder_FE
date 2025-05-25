// src/pages/admin/RequestAlertPage.tsx
import { useEffect, useState, useRef } from 'react'
import type { CustomerRequestDTO } from '@/api'
import { listRequestsAdmin, deleteRequest } from '@/api'

export default function RequestAlertPage() {
  const [reqs, setReqs] = useState<CustomerRequestDTO[]>([])
  // 이전 요청 ID 집합 저장용
  const prevIdsRef = useRef<Set<number>>(new Set())
  // 알림용 오디오
  const audioRef = useRef<HTMLAudioElement>(new Audio('/sounds/choinjong.mp3'))

  const fetchReqsWithAlert = async () => {
    try {
      const res = await listRequestsAdmin()
      const newList = res.data.data

      // 새로 들어온 호출 ID가 있는지 검사
      const prevIds = prevIdsRef.current
      const newIds = new Set(newList.map(r => r.id))
      const hasNew = [...newIds].some(id => !prevIds.has(id))
      if (hasNew) {
        audioRef.current.play().catch(() => {
          // 자동 재생 차단 시, 필요하면 사용자에게 안내
        })
      }
      // 상태 업데이트
      setReqs(newList)
      prevIdsRef.current = newIds
    } catch (err) {
      console.error('요청 알림 조회 실패', err)
    }
  }

  useEffect(() => {
    // 최초 로드 시 호출
    fetchReqsWithAlert()
    const iv = setInterval(fetchReqsWithAlert, 5000)
    return () => clearInterval(iv)
  }, [])

  const handleProcess = async (id: number) => {
    try {
      await deleteRequest(id)
      setReqs(prev => prev.filter(r => r.id !== id))
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
              {' '}{r.tableNumber}번 테이블 호출
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

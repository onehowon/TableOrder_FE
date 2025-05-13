import { useEffect, useState } from 'react'
import { listRequestsAdmin, deleteRequest } from '@/api'
import type { CustomerRequestDTO } from '@/api'

export default function RequestAlertPage() {
  const [reqs, setReqs] = useState<CustomerRequestDTO[]>([])

  // 서버에서 요청 리스트를 가져옵니다
  const fetch = async () => {
    try {
      const res = await listRequestsAdmin()
      setReqs(res.data.data)
    } catch (err) {
      console.error('요청 리스트 조회 실패', err)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  // 처리 버튼 클릭 시 상태를 DELETED 로 변경하고 재조회
  const onDelete = async (id: number) => {
    try {
      await deleteRequest(id)
      fetch()
    } catch (err) {
      console.error('요청 처리 실패', err)
      alert('요청 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">직원 호출 알림</h2>

      {reqs.length === 0 ? (
        <p className="text-gray-500">현재 알림이 없습니다.</p>
      ) : (
        reqs.map(r => (
          <div
            key={r.id}
            className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow"
          >
            <span className="text-gray-800">
              {new Date(r.createdAt).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}{' '}
              {r.tableNumber}번 테이블 호출
            </span>
            <button
              onClick={() => onDelete(r.id)}
              className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition"
            >
              처리
            </button>
          </div>
        ))
      )}
    </div>
  )
}

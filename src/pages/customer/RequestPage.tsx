// src/pages/customer/RequestPage.tsx
import { useState } from 'react'
import { useTable } from '@/contexts/TableContext'
import { postRequest } from '@/api'
import { useNavigate } from 'react-router-dom'

export default function RequestPage() {
  const { tableId } = useTable()
  const nav = useNavigate()

  // 요청 타입들: WATER, TISSUE, CALL, CHOPSTICKS 중 하나
  const [type, setType] = useState<'WATER' | 'TISSUE' | 'CALL' | 'CHOPSTICKS'>('CALL')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!tableId) return
    setLoading(true)
    try {
      await postRequest({
        tableNumber: Number(tableId),
        type,
        items: []  // 직원호출/기타 요청은 메뉴 아이템이 없으므로 빈 배열
      })
      alert('요청이 전송되었습니다!')
      nav(`/customer/${tableId}/welcome`, { replace: true })
    } catch (err) {
      console.error('요청 전송 실패', err)
      alert('요청 전송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">요청 사항</h1>
      <select
        value={type}
        onChange={e => setType(e.target.value as any)}
        className="w-full border p-2 rounded"
      >
        <option value="TISSUE">휴지</option>
        <option value="CALL">직원 부르기</option>
        <option value="CHOPSTICKS">젓가락</option>
        <option value="WATER">물</option>
      </select>
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? '전송 중…' : '전송하기'}
      </button>
    </div>
  )
}

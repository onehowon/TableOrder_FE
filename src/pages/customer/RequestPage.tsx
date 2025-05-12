import { useState } from 'react'
import { useTable } from '@/contexts/TableContext'
import { postRequest } from '@/api'
import { useNavigate } from 'react-router-dom'

export default function RequestPage() {
  const { tableId } = useTable()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!tableId) return
    setLoading(true)
    try {
      // 이제 tableNumber만 전달합니다.
      await postRequest({
        tableNumber: Number(tableId),
      })
      alert('요청이 전송되었습니다!')
      nav(`/customer/${tableId}`, { replace: true })
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
      {/* 불필요한 select 는 제거하고, 버튼만 남겼습니다 */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? '전송 중…' : '직원호출 전송하기'}
      </button>
    </div>
  )
}

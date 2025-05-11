// src/pages/customer/RequestPage.tsx
import { useState }           from 'react'
import { useTable }           from '@/contexts/TableContext'
import { postCustomerRequest } from '@/api/customer'
import { useNavigate }        from 'react-router-dom'

export default function RequestPage() {
  const { tableId } = useTable()
  const nav         = useNavigate()
  const [type, setType] = useState<'WATER'|'TISSUE'|'CALL'|'CHOPSTICKS'>('CALL')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!tableId) return
    setLoading(true)
    try {
      await postCustomerRequest(
        Number(tableId),
        type
      )
      alert('요청이 전송되었습니다!')
      nav(`/customer/${tableId}/welcome`)
    } catch {
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
        className="border p-2 rounded"
      >
        <option value="WATER">물</option>
        <option value="TISSUE">휴지</option>
        <option value="CALL">직원 부르기</option>
        <option value="CHOPSTICKS">젓가락</option>
      </select>
      <button
        onClick={handleSend}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? '전송 중…' : '전송하기'}
      </button>
    </div>
  )
}

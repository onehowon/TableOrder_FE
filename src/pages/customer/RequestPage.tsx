// ─ src/pages/customer/RequestPage.tsx ─────────────────────────
import { useState } from 'react'
import { useTable } from '@/contexts/TableContext'
import { postCustomerRequest } from '@/api/customer'
import { useNavigate } from 'react-router-dom'

export default function RequestPage() {
  const { tableId } = useTable()
  const [type, setType] = useState<'WATER'|'TISSUE'|'CHOPSTICKS'|'CALL'>('WATER')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleSubmit = async () => {
    if (!tableId) return
    setLoading(true)
    try {
      await postCustomerRequest(Number(tableId), type)
      alert('직원 호출 요청이 전송되었습니다.')
      nav(`/customer/${tableId}/summary`)
    } catch (err) {
      console.error(err)
      alert('요청 전송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">요청 사항</h1>

      <label className="block">
        <span className="text-gray-700">원하는 요청</span>
        <select
          value={type}
          onChange={e => setType(e.target.value as any)}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="WATER">물</option>
          <option value="TISSUE">휴지</option>
          <option value="CHOPSTICKS">젓가락</option>
          <option value="CALL">직원 부르기</option>
        </select>
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '전송 중…' : '전송하기'}
      </button>
    </div>
  )
}

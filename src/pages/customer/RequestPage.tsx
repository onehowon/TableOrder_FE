// src/pages/customer/RequestPage.tsx
import { useTable } from '@/contexts/TableContext'
import { postCustomerRequest } from '@/api/customer'
import { useState } from 'react'

export default function RequestPage() {
  const { tableId } = useTable()
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const send = async () => {
    if (!tableId || !note) return
    await postCustomerRequest(Number(tableId), note)
    setSent(true)
  }

  if (sent) return <p className="p-4">점원에게 알림을 전송했습니다.</p>

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">요청 사항</h2>
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="예) 물 좀 더 주세요"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <button
        className="btn-primary"
        onClick={send}
        disabled={!note.trim()}
      >
        전송하기
      </button>
    </div>
  )
}

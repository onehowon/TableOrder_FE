// src/pages/customer/WelcomePage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const [table, setTable] = useState('')
  const nav = useNavigate()

  const goNext = () => {
    if (table.trim()) {
      nav(`/customer/${table}/menu`)
    }
  }

  return (
    <div className="p-4 space-y-6 text-center">
      <h2 className="text-2xl font-bold">IBIZ 주점에 오신 걸 환영합니다!</h2>
      <p>테이블 번호를 입력해주세요</p>
      <input
        type="number"
        value={table}
        onChange={e => setTable(e.target.value)}
        className="border p-2 rounded w-full max-w-xs"
        placeholder="예) 1"
      />
      <button
        className="btn-primary"
        onClick={goNext}
        disabled={!table.trim()}
      >
        메뉴 보러 가기
      </button>
    </div>
  )
}

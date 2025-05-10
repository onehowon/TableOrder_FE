// src/pages/TableOrderPage.tsx
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function TableOrderPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const { setTableId } = useTable()
  const navigate = useNavigate()

  useEffect(() => {
    if (tableId) {
      setTableId(tableId)
      navigate('/menu', { replace: true })
    }
  }, [tableId, setTableId, navigate])

  return (
    <div className="px-2 py-4 max-w-lg mx-auto sm:px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">테이블 {tableId} 확인 중…</h2>
      <p className="text-gray-500">잠시만 기다려 주세요.</p>
    </div>
  )
}

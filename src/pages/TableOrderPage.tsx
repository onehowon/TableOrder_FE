// src/pages/TableOrderPage.tsx
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function TableOrderPage() {
  const { tableId } = useParams<{tableId:string}>()
  const { setTableId } = useTable()
  const nav = useNavigate()

  useEffect(()=>{
    if (tableId) {
      setTableId(tableId)
      nav('/welcome')
    }
  },[tableId])

  return <p className="text-center mt-20">테이블 {tableId}번 로딩 중…</p>
}

// src/pages/WelcomePage.tsx
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function WelcomePage() {
  const { tableId } = useParams<{ tableId:string }>()
  const { setTableId } = useTable()
  const navigate = useNavigate()

  useEffect(() => {
    if (tableId) {
      setTableId(tableId)
      navigate('/menu', { replace: true })  // 즉시 메뉴로
    }
  }, [tableId, setTableId, navigate])

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">어서오세요!</h1>
      <p>테이블 {tableId}에 연결되었습니다.</p>
      <p className="mt-2 text-gray-600">잠시만 기다려 주세요…</p>
    </div>
  )
}

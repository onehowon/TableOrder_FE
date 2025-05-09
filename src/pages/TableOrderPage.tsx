import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function TableOrderPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const { setTableId } = useTable()
  const navigate = useNavigate()

  useEffect(() => {
    if (tableId) {
      // Context와 localStorage에 저장
      setTableId(tableId)
      // 메뉴 페이지로 자동 이동
      navigate('/menu', { replace: true })
    }
  }, [tableId, setTableId, navigate])

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>
        테이블 {tableId} 확인 중…
      </h2>
      <p>잠시만 기다려 주세요.</p>
    </div>
  )
}

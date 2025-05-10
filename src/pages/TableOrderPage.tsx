import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function TableOrderPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const { setTableId } = useTable()
  const navigate = useNavigate()

  useEffect(() => {
    if (!tableId) return

    // 숫자만 허용
    if (Number.isNaN(Number(tableId))) {
      navigate('/', { replace: true })
      return
    }

    setTableId(tableId)            // Context + localStorage
    navigate('/menu', { replace: true })
  }, [tableId, setTableId, navigate])

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>테이블 확인 중…</h2>
    </div>
  )
}

// src/pages/GuestHomePage.tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function GuestHomePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTableId } = useTable()

  useEffect(() => {
    const id = searchParams.get('tableId')
    if (id) {
      setTableId(id)
      navigate('/menu', { replace: true })
    }
  }, [searchParams, setTableId, navigate])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 16,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
        잘못된 접근입니다
      </h1>
      <p style={{ fontSize: 16, color: '#666' }}>
        테이블 위 QR 코드를 다시 스캔해 주세요.
      </p>
    </div>
  )
}

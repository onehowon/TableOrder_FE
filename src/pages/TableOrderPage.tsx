// src/pages/TableOrderPage.tsx
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../contexts/TableContext'

export default function TableOrderPage() {
  const { tableId: paramId } = useParams<{ tableId: string }>()
  const { setTableId }       = useTable()
  const nav                  = useNavigate()

  useEffect(() => {
    if (paramId) {
      setTableId(paramId)
      nav('/welcome', { replace: true })   // ✅ 메뉴 대신 Welcome
    } else {
      nav('/', { replace: true })
    }
  }, [paramId, setTableId, nav])

  return null
}

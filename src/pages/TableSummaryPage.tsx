// src/pages/TableSummaryPage.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

interface ItemSummary { name:string; quantity:number; totalPrice:number }
interface TableSummaryResp {
  tableNumber:number; totalOrders:number; totalAmount:number; items:ItemSummary[]
}

export default function TableSummaryPage() {
  const { tableId } = useParams<{tableId:string}>()
  const nav = useNavigate()
  const [s, setS] = useState<TableSummaryResp|null>(null)
  const [l, setL] = useState(true)
  const [e, setE] = useState<string|null>(null)

  useEffect(()=>{
    (async()=>{
      if(!tableId){ setE('테이블 정보 누락'); setL(false); return }
      try {
        const r = await api.get(`/customer/tables/${tableId}/summary`)
        setS(r.data.data)
      } catch { setE('불러오기 실패') }
      setL(false)
    })()
  },[tableId])

  if(l) return <p className="text-center">로딩 중…</p>
  if(e) return <p className="text-center text-red-500">{e}</p>
  if(!s) return null

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">테이블 {s.tableNumber} 요약</h2>
      <p>총 주문 수: {s.totalOrders}회</p>
      <p>총 금액: <b>{s.totalAmount.toLocaleString()}원</b></p>
      <h3 className="mt-4 font-semibold">메뉴별 합계</h3>
      <ul className="list-disc list-inside mb-4">
        {s.items.map(it=>(
          <li key={it.name}>{it.name} × {it.quantity}개 ({it.totalPrice.toLocaleString()}원)</li>
        ))}
      </ul>
      <button onClick={()=>nav('/menu')} className="btn-primary w-full">다시 주문하기</button>
    </div>
  )
}

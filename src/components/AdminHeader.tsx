// src/components/AdminHeader.tsx
import { useNavigate } from 'react-router-dom'
export default function AdminHeader({ title }: { title:string }) {
  const nav = useNavigate()
  return (
    <header className="bg-zinc-900 text-white p-4 flex items-center gap-4">
      <button onClick={()=>nav(-1)} className="btn-secondary">← 뒤로</button>
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  )
}

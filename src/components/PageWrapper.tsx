import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PageWrapper({ title, children }: { title: string; children: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <button
        onClick={() => nav('/')}
        className="mb-4 text-sm text-gray-300 hover:text-white"
      >
        ← 홈으로
      </button>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  )
}
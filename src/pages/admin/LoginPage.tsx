// src/pages/admin/LoginPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { CommonResp } from '../../api'  // CommonResp 가져오기

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const nav = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // CommonResp<{ accessToken: string }> 타입 사용
      const res = await api.post<CommonResp<{ accessToken: string }>>(
        '/login',
        { email, password }
      )
      const token = res.data.data.accessToken
      localStorage.setItem('accessToken', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      nav('/admin/alerts', { replace: true })
    } catch (e: any) {
      setError(e.response?.data?.message || '로그인에 실패했습니다.')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="w-80 p-6 bg-white rounded shadow">
        <h2 className="text-2xl mb-4 text-center">Admin 로그인</h2>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 w-full border rounded px-2 py-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="mt-1 w-full border rounded px-2 py-1"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
    </div>
  )
}

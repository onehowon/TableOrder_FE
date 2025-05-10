// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import api from '../api'

interface Menu {
  id: number
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl?: string
}

export default function AdminPage() {
  const [tab, setTab] = useState<'menu' | 'order' | 'table'>('menu')
  const [menus, setMenus] = useState<Menu[]>([])
  const [form, setForm] = useState<{
    name: string
    description: string
    price: string
    isAvailable: boolean
    file: File | null
  }>({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    file: null
  })
  const [editId, setEditId] = useState<number | null>(null)

  // 서버에서 메뉴 리스트 조회
  const fetchMenus = () => {
    api
      .get('/admin/menus')
      .then(res => setMenus(res.data.data || []))
      .catch(() => alert('메뉴 목록을 불러오지 못했습니다.'))
  }

  useEffect(fetchMenus, [])

  // 폼 입력 처리
  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // 파일 입력 처리
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
  
    setForm(prev => ({
      ...prev,
      file: files[0]
    }))
  }

  // “수정” 눌렀을 때 폼에 값 채우기
  const fillForm = (menu: Menu) => {
    setForm({
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      isAvailable: menu.isAvailable,
      file: null
    })
    setEditId(menu.id)
  }

  // 활성화/비활성화 토글
  const toggleAvailability = (id: number, isAvailable: boolean) => {
    const action = isAvailable ? 'deactivate' : 'activate'
    api
      .put(`/admin/menus/${id}/${action}`)
      .then(fetchMenus)
      .catch(() =>
        alert(`${isAvailable ? '비활성화' : '활성화'}에 실패했습니다.`)
      )
  }

  // 등록 / 수정 제출
  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('isAvailable', String(form.isAvailable))
    if (form.file) formData.append('file', form.file)

    const req = editId
      ? api.put(`/admin/menus/${editId}`, formData)
      : api.post('/admin/menus', formData)

    req
      .then(() => {
        fetchMenus()
        setForm({ name: '', description: '', price: '', isAvailable: true, file: null })
        setEditId(null)
      })
      .catch(() => alert('저장에 실패했습니다.'))
  }

  // 편집 취소
  const handleCancelEdit = () => {
    setEditId(null)
    setForm({ name: '', description: '', price: '', isAvailable: true, file: null })
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab('menu')} style={{ fontWeight: tab === 'menu' ? 'bold' : 'normal' }}>
          메뉴 관리
        </button>
        <button onClick={() => setTab('order')} style={{ fontWeight: tab === 'order' ? 'bold' : 'normal' }}>
          주문 관리
        </button>
        <button onClick={() => setTab('table')} style={{ fontWeight: tab === 'table' ? 'bold' : 'normal' }}>
          테이블 요약
        </button>
      </div>

      {tab === 'menu' && (
        <div style={{ marginBottom: 24 }}>
          <input
            name="name"
            value={form.name}
            placeholder="이름"
            onChange={handleInput}
            style={{ marginRight: 8 }}
          />
          <input
            name="price"
            value={form.price}
            placeholder="가격"
            type="number"
            onChange={handleInput}
            style={{ marginRight: 8 }}
          />
          <textarea
            name="description"
            value={form.description}
            placeholder="설명"
            onChange={handleInput}
            style={{ marginRight: 8 }}
          />
          <label style={{ marginRight: 8 }}>
            <input
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={handleInput}
            /> 판매중
          </label>
          <input type="file" accept="image/*" onChange={handleFile} />
          <button onClick={handleSubmit} style={{ marginLeft: 8 }}>
            {editId ? '수정 완료' : '메뉴 추가'}
          </button>
          {editId && (
            <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
              취소
            </button>
          )}
        </div>
      )}

      {tab === 'order' && <div>주문 관리 페이지 (추후 구현)</div>}
      {tab === 'table' && <div>테이블 요약 페이지 (추후 구현)</div>}

      <ul style={{ padding: 0 }}>
        {menus.map(menu => (
          <li key={menu.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
            <p style={{ fontWeight: 'bold' }}>
              {menu.name} – {menu.price.toLocaleString()}원{' '}
              <span style={{ color: menu.isAvailable ? 'green' : 'red' }}>
                ({menu.isAvailable ? '판매중' : '판매중지'})
              </span>
            </p>
            <p>{menu.description}</p>
            {menu.imageUrl && (
              <img src={menu.imageUrl} alt={menu.name} style={{ width: 96, marginTop: 4 }} />
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => fillForm(menu)}>수정</button>
              <button onClick={() => toggleAvailability(menu.id, menu.isAvailable)}>
                {menu.isAvailable ? '비활성화' : '활성화'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

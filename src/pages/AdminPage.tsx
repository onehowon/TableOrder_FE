import { useState, useEffect } from 'react'
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
  const [menus, setMenus] = useState<Menu[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    file: null as File | null,
  })
  const [editId, setEditId] = useState<number | null>(null)

  const fetchMenus = () => {
    api
      .get('/admin/menus')
      .then(res => setMenus(res.data.data || []))
      .catch(() => alert('메뉴 목록을 불러오지 못했습니다.'))
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, file: e.target.files[0] })
    }
  }

  const fillForm = (menu: Menu) => {
    setForm({
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      isAvailable: menu.isAvailable,
      file: null,
    })
    setEditId(menu.id)
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    api
      .delete(`/admin/menus/${id}`)
      .then(fetchMenus)
      .catch(() => alert('삭제에 실패했습니다.'))
  }

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

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>메뉴 관리</h2>

      <div style={{ marginBottom: 24 }}>
        <input
          name="name"
          value={form.name}
          placeholder="이름"
          onChange={handleInput}
          style={{ border: '1px solid #ccc', padding: 8, marginRight: 8 }}
        />
        <input
          name="price"
          value={form.price}
          placeholder="가격"
          type="number"
          onChange={handleInput}
          style={{ border: '1px solid #ccc', padding: 8, marginRight: 8 }}
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="설명"
          onChange={handleInput}
          style={{ border: '1px solid #ccc', padding: 8, marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleInput}
          />{' '}
          판매중
        </label>
        <input type="file" accept="image/*" onChange={handleFile} />
        <button
          onClick={handleSubmit}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            marginLeft: 8,
          }}
        >
          {editId ? '수정 완료' : '메뉴 추가'}
        </button>
        {editId && (
          <button
            onClick={() => {
              setEditId(null)
              setForm({ name: '', description: '', price: '', isAvailable: true, file: null })
            }}
            style={{ marginLeft: 8, color: '#888' }}
          >
            취소
          </button>
        )}
      </div>

      <ul style={{ padding: 0 }}>
        {menus.map(menu => (
          <li
            key={menu.id}
            style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}
          >
            <p style={{ fontWeight: 'bold' }}>
              {menu.name} - {menu.price.toLocaleString()}원
            </p>
            <p>{menu.description}</p>
            {menu.imageUrl && (
              <img
                src={menu.imageUrl}
                alt={menu.name}
                style={{ width: 96, marginTop: 4 }}
              />
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => fillForm(menu)}
                style={{
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(menu.id)}
                style={{
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
)
}

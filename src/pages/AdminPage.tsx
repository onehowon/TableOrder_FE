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

interface Order {
  id: number
  tableNumber: number
  totalAmount: number
  status: string
  items: { menuName: string; quantity: number }[]
}

interface TableSummary {
  tableNumber: number
  totalOrders: number
  totalAmount: number
  items: { name: string; quantity: number; totalPrice: number }[]
}

export default function AdminPage() {
  const [tab, setTab] = useState<'menu' | 'order' | 'table'>('menu')

  // 메뉴 관리
  const [menus, setMenus] = useState<Menu[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    file: null as File | null,
  })
  const [editId, setEditId] = useState<number | null>(null)

  // 주문 관리
  const [orders, setOrders] = useState<Order[]>([])

  // 테이블 요약
  const [summaries, setSummaries] = useState<TableSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ────────────────────────────────────────────
  // 메뉴 CRUD
  // ────────────────────────────────────────────
  const fetchMenus = () => {
    api
      .get('/admin/menus')
      .then(res => setMenus(res.data.data))
      .catch(() => alert('메뉴 목록을 불러오지 못했습니다.'))
  }

  useEffect(fetchMenus, [])

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setForm(prev => ({ ...prev, file: files[0] }))
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

  const toggleAvailability = (id: number, isAvailable: boolean) => {
    const action = isAvailable ? 'deactivate' : 'activate'
    api
      .put(`/admin/menus/${id}/${action}`)
      .then(fetchMenus)
      .catch(() => alert(`${isAvailable ? '비활성화' : '활성화'}에 실패했습니다.`))
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

  const handleCancelEdit = () => {
    setEditId(null)
    setForm({ name: '', description: '', price: '', isAvailable: true, file: null })
  }

  // ────────────────────────────────────────────
  // 주문 관리
  // ────────────────────────────────────────────
  const fetchOrders = () => {
    api
      .get('/admin/orders')
      .then(res => setOrders(res.data.data))
      .catch(() => alert('주문 목록을 불러오지 못했습니다.'))
  }
  useEffect(() => { if (tab === 'order') fetchOrders() }, [tab])

  const markAs = (orderId: number, status: string) => {
    api
      .put(`/admin/orders/${orderId}/status`, { status })
      .then(fetchOrders)
      .catch(() => alert('상태 변경에 실패했습니다.'))
  }

  // ────────────────────────────────────────────
  // 테이블 요약
  // ────────────────────────────────────────────
  const fetchSummaries = () => {
    setLoading(true)
    api
      .get('/admin/tables/summary') // 백엔드에 “전체 테이블 요약” endpoint 필요
      .then(res => {
        setSummaries(res.data.data)
        setError(null)
      })
      .catch(() => setError('테이블 요약을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { if (tab === 'table') fetchSummaries() }, [tab])

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

      {/** ───────────────────────────────────────── **/}

      {tab === 'menu' && (
        <div style={{ marginBottom: 24 }}>
          <input name="name" value={form.name} placeholder="이름" onChange={handleInput} style={{ marginRight: 8 }} />
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
            />{' '}
            판매중
          </label>
          <input type="file" accept="image/*" onChange={handleFile} />
          <button onClick={handleSubmit} style={{ marginLeft: 8 }}>
            {editId ? '수정 완료' : '메뉴 추가'}
          </button>
          {editId && <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>취소</button>}
          <ul style={{ padding: 0, marginTop: 16 }}>
            {menus.map(menu => (
              <li key={menu.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
                <p style={{ fontWeight: 'bold' }}>
                  {menu.name} – {menu.price.toLocaleString()}원{' '}
                  <span style={{ color: menu.isAvailable ? 'green' : 'red' }}>
                    ({menu.isAvailable ? '판매중' : '중단'})
                  </span>
                </p>
                <p>{menu.description}</p>
                {menu.imageUrl && <img src={menu.imageUrl} alt={menu.name} style={{ width: 96, marginTop: 4 }} />}
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
      )}

      {tab === 'order' && (
        <div>
          <h2 style={{ marginBottom: 16 }}>주문 관리</h2>
          <ul style={{ padding: 0 }}>
            {orders.map(o => (
              <li key={o.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
                <p>테이블: {o.tableNumber}</p>
                <p>총 금액: {o.totalAmount.toLocaleString()}원</p>
                <p>상태: {o.status}</p>
                <ul style={{ marginTop: 8 }}>
                  {o.items.map((it, i) => (
                    <li key={i}>{it.menuName} x {it.quantity}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  {['WAITING','SERVED'].map(st =>
                    o.status !== st && (
                      <button
                        key={st}
                        onClick={() => markAs(o.id, st)}
                        style={{ padding: '4px 12px', cursor: 'pointer' }}
                      >
                        {st === 'SERVED' ? '서빙 완료' : '대기 중'}
                      </button>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'table' && (
        <div>
          <h2 style={{ marginBottom: 16 }}>전체 테이블 요약</h2>
          {loading && <p>로딩 중…</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {summaries.map(s => (
              <div key={s.tableNumber} style={{ border: '1px solid #ddd', padding: 12 }}>
                <h3>테이블 {s.tableNumber}</h3>
                <p>총 주문: {s.totalOrders}건</p>
                <p>총 금액: {s.totalAmount.toLocaleString()}원</p>
                <h4 style={{ marginTop: 8 }}>메뉴별 합계</h4>
                <ul style={{ fontSize: 14 }}>
                  {s.items.map(it => (
                    <li key={it.name}>
                      {it.name} × {it.quantity}개 ({it.totalPrice.toLocaleString()}원)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

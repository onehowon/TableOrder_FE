// src/pages/AdminPage.tsx
import { useEffect, useState } from 'react'
import {
  getAdminMenus,
  createAdminMenu,
  updateAdminMenu,
  deleteAdminMenu,
  activateAdminMenu,
  deactivateAdminMenu
} from '../api'

interface MenuDTO {
  id: number
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl?: string
}

export default function AdminPage() {
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState<MenuDTO | null>(null)
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

  // 메뉴 목록 가져오기
  const fetch = () => {
    setLoading(true)
    getAdminMenus()
      .then(r => setMenus(r.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(fetch, [])

  const resetForm = () => {
    setEdit(null)
    setForm({ name: '', description: '', price: '', isAvailable: true, file: null })
  }

  const onSubmit = async () => {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('description', form.description)
    fd.append('price', form.price)
    fd.append('isAvailable', String(form.isAvailable))
    if (form.file) {
      fd.append('file', form.file)
    }

    if (edit) {
      await updateAdminMenu(edit.id, fd)
    } else {
      await createAdminMenu(fd)
    }

    resetForm()
    fetch()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">메뉴 관리</h2>
      {loading && <p className="text-center">로딩 중…</p>}

      {/* Form */}
      <div className="bg-zinc-800 rounded-xl p-6 mb-8 space-y-4">
        <input
          className="w-full bg-zinc-700 p-2 rounded"
          placeholder="이름"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="w-full bg-zinc-700 p-2 rounded"
          placeholder="설명"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full bg-zinc-700 p-2 rounded"
          type="number"
          placeholder="가격"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
          />
          판매중
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={e =>
            setForm({
              ...form,
              file: e.target.files?.[0] ?? null
            })
          }
        />

        <button className="btn-primary" onClick={onSubmit}>
          {edit ? '수정' : '추가'}
        </button>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {menus.map(m => (
          <li
            key={m.id}
            className="bg-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{m.name}</p>
              <p className="text-gray-400 text-sm mb-2">{m.description}</p>
              <p>{m.price.toLocaleString()}원</p>
              <p className={m.isAvailable ? 'text-green-400' : 'text-red-400'}>
                {m.isAvailable ? '판매중' : '중단'}
              </p>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0">
              {!m.isAvailable ? (
                <button
                  className="btn-primary"
                  onClick={() => {
                    activateAdminMenu(m.id).then(fetch)
                  }}
                >
                  활성화
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    deactivateAdminMenu(m.id).then(fetch)
                  }}
                >
                  비활성
                </button>
              )}

              <button
                className="btn-primary"
                onClick={() => {
                  setEdit(m)
                  setForm({
                    name: m.name,
                    description: m.description,
                    price: String(m.price),
                    isAvailable: m.isAvailable,
                    file: null
                  })
                }}
              >
                수정
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  deleteAdminMenu(m.id).then(fetch)
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

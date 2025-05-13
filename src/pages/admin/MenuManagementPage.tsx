// src/pages/admin/MenuManagementPage.tsx
import { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  listAdminMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from '@/api'
import type { MenuDTO } from '@/api'

type Mode = 'add' | 'delete' | 'edit'

export default function MenuManagementPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('add')
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [selected, setSelected] = useState<MenuDTO | null>(null)

  // 폼 state
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)  // ← 품절(판매가능) 토글

  // 메뉴 리스트 로드
  useEffect(() => {
    loadMenus()
  }, [])

  async function loadMenus() {
    try {
      const res = await listAdminMenus()
      setMenus(res.data.data)
    } catch {
      alert('메뉴 목록을 불러오는 데 실패했습니다.')
    }
  }

  // ▶ 수정 모드: selected 가 바뀌면 폼에 기존 값 채워넣기
  useEffect(() => {
    if ((mode === 'edit' || mode === 'delete') && selected) {
      setName(selected.name)
      setDescription(selected.description)
      setPrice(String(selected.price))
      setPreview(selected.imageUrl ?? null)
      setIsAvailable(selected.isAvailable)  // ← 기존 판매 가능 여부 반영
    } else if (mode === 'add') {
      resetForm()
    }
  }, [mode, selected])

  // 파일 선택 & 프리뷰
  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (!f) return setPreview(null)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  // 추가, 수정 공통 submit
  async function handleSubmit() {
    if (!name || !description || !price) {
      alert('모든 필드를 입력해주세요.')
      return
    }
    const fd = new FormData()
    fd.append('name', name)
    fd.append('description', description)
    fd.append('price', price)
    fd.append('isAvailable', String(isAvailable))    // ← 판매 가능 여부 전송
    if (file) fd.append('file', file)

    try {
      if (mode === 'add') {
        await createMenu(fd)
        alert('메뉴 등록 완료')
      } else if (mode === 'edit' && selected) {
        await updateMenu(selected.id, fd)
        alert('메뉴 수정 완료')
      }
      await loadMenus()
      resetForm()
    } catch {
      alert('요청 중 오류가 발생했습니다.')
    }
  }

  // 삭제
  async function handleDelete() {
    if (!selected) {
      alert('삭제할 메뉴를 선택해주세요.')
      return
    }
    if (!confirm(`${selected.name} 을(를) 정말 삭제하시겠습니까?`)) return
    try {
      await deleteMenu(selected.id)
      alert('메뉴 삭제 완료')
      await loadMenus()
      setSelected(null)
    } catch {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  function resetForm() {
    setFile(null)
    setPreview(null)
    setName('')
    setDescription('')
    setPrice('')
    setIsAvailable(true)
  }

  return (
    <div className="flex h-full">
      {/* ◀ 왼쪽 탭 */}
      <aside className="w-1/4 bg-gray-50 p-6 border-r">
        <button
          onClick={() => { setMode('add'); setSelected(null); resetForm() }}
          className={`block mb-4 w-full py-2 rounded-lg text-white ${
            mode === 'add' ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          Menu management
        </button>
        <nav className="space-y-2">
          {(['add','delete','edit'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setSelected(null); resetForm() }}
              className={`flex items-center w-full py-2 px-4 rounded-lg ${
                mode === m
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">✉️</span>
              {m === 'add' ? '추가' : m === 'delete' ? '삭제' : '수정'}
            </button>
          ))}
        </nav>
      </aside>

      {/* ▶ 오른쪽 컨텐츠 */}
      <section className="flex-1 p-8 bg-white overflow-auto">
        {/* 뒤로가기 + 제목 */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-500">
            ←
          </button>
          <h1 className="text-xl font-medium">
            메뉴 관리 ({mode === 'add' ? '추가' : mode === 'edit' ? '수정' : '삭제'})
          </h1>
        </div>

        {/* 삭제 모드 */}
        {mode === 'delete' && (
          <div className="max-w-md">
            <select
              className="w-full p-3 border rounded-lg mb-4"
              value={selected?.id ?? ''}
              onChange={e => {
                const m = menus.find(x => x.id === +e.target.value) || null
                setSelected(m)
              }}
            >
              <option value="">삭제할 메뉴 선택</option>
              {menus.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <button
              onClick={handleDelete}
              className="px-6 py-2 border rounded-lg hover:bg-red-50 text-red-600"
            >
              삭제하기
            </button>
          </div>
        )}

        {/* 추가/수정 모드 */}
        {(mode === 'add' || mode === 'edit') && (
          <div className="space-y-6 max-w-xl">
            {/* 수정 모드일 때만 메뉴 선택 드롭다운 추가 */}
            {mode === 'edit' && (
              <select
                className="w-full p-3 border rounded-lg"
                value={selected?.id ?? ''}
                onChange={e => {
                  const m = menus.find(x => x.id === +e.target.value) || null
                  setSelected(m)
                }}
              >
                <option value="">수정할 메뉴 선택</option>
                {menus.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            )}

            {/* 파일 업로드 박스 */}
            <div className="relative">
              <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview"
                       className="h-full object-contain rounded-lg" />
                ) : (
                  <span className="text-gray-500">📷 이미지 업로드</span>
                )}
              </div>
              <input
                type="file" accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* 메뉴 이름 */}
            <div className="grid grid-cols-4 gap-4">
              <label className="col-span-1 flex items-center justify-center border rounded-lg">
                메뉴 이름 ▼
              </label>
              <input
                className="col-span-3 p-3 border rounded-lg focus:outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="메뉴 이름을 입력하세요"
              />
            </div>

            {/* 메뉴 소개 */}
            <div className="grid grid-cols-4 gap-4">
              <label className="col-span-1 flex items-center justify-center border rounded-lg">
                메뉴 소개 ▼
              </label>
              <input
                className="col-span-3 p-3 border rounded-lg focus:outline-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="메뉴 설명을 입력하세요"
              />
            </div>

            {/* 메뉴 가격 */}
            <div className="grid grid-cols-4 gap-4">
              <label className="col-span-1 flex items-center justify-center border rounded-lg">
                가격 ▼
              </label>
              <input
                type="number"
                className="col-span-3 p-3 border rounded-lg focus:outline-none"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="메뉴 가격을 입력하세요"
              />
            </div>

            {/* 품절 토글 */}
            <div className="grid grid-cols-4 gap-4">
              <label className="col-span-1 flex items-center justify-center border rounded-lg">
                품절 여부 ▼
              </label>
              <div className="col-span-3 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!isAvailable}
                    onChange={() => setIsAvailable(prev => !prev)}
                  />
                  <span>{isAvailable ? '판매 중' : '품절'}</span>
                </label>
              </div>
            </div>

            {/* 버튼 */}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              {mode === 'add' ? '메뉴 등록하기' : '메뉴 수정하기'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

// src/pages/customer/MenuIntroPage.tsx
import { useState, useEffect } from 'react'
import { listAllMenus } from '@/api'
import type { MenuDTO } from '@/api'

export default function MenuIntroPage() {
  const [menus, setMenus] = useState<MenuDTO[]>([])

  useEffect(() => {
    listAllMenus()
      .then(res => {
        // isAvailable인 메뉴만 필터링
        setMenus(res.data.data.filter(m => m.isAvailable))
      })
      .catch(() => {
        alert('메뉴 정보를 불러오는 데 실패했습니다.')
      })
  }, [])

  return (
    <div className="w-full min-h-screen bg-green-50 flex flex-col font-woowahan">
      {/* 헤더 */}
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold leading-tight">
          <span className="text-green-600">아이비즈</span> 메뉴 소개
        </h1>
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {menus.length === 0 ? (
          <p className="text-center text-gray-500">
            현재 등록된 메뉴가 없습니다.
          </p>
        ) : (
          menus.map(menu => (
            <div
              key={menu.id}
              className="flex items-center justify-between pb-4 border-b border-gray-200"
            >
              {/* 이미지 + 텍스트 */}
              <div className="flex items-center space-x-4 min-w-0">
                <img
                  src={menu.imageUrl || '/placeholder.png'}
                  alt={menu.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-base font-medium whitespace-normal">
                    {menu.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {menu.price.toLocaleString()}원
                  </p>
                  {/* 설명 필드가 있으면 표시 */}
                  {menu.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {menu.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

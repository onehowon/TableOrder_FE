// src/components/layout/AdminLayout.tsx
import { Outlet } from 'react-router-dom'
import SideNav from '../SideNav'

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-6 bg-white border-b shadow-sm">
          <h1 className="text-xl font-bold">admin page</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

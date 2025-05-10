// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import GuestHomePage         from './pages/GuestHomePage'
import WelcomePage           from './pages/WelcomePage'
import MenuPage              from './pages/MenuPage'
import OrderConfirmPage      from './pages/OrderConfirmPage'
import OrderStatusPage       from './pages/OrderStatusPage'
import OrderHistoryPage      from './pages/OrderHistoryPage'
import TableSummaryPage      from './pages/TableSummaryPage'
import TableOrderPage        from './pages/TableOrderPage'

import AdminHeader           from './components/AdminHeader'
import AdminHomePage         from './pages/AdminHomePage'
import AdminPage             from './pages/AdminPage'
import OrderAdminPage        from './pages/OrderAdminPage'
import TableAdminSummaryPage from './pages/TableAdminSummaryPage'

import CartMiniWidget        from './components/CartMiniWidget'
import './App.css'

export default function App() {
  const loc = useLocation()
  const isAdmin = loc.pathname.startsWith('/admin')

  return (
    <>
      {isAdmin && <AdminHeader title="관리자 대시보드" />}
      <Routes>
        {/* QR 스캔 → Context 저장 → Welcome으로 */}
        <Route path="/:tableId" element={<TableOrderPage />} />
        <Route path="/welcome"  element={<WelcomePage   />} />

        {/* 손님용 */}
        <Route path="/"                         element={<GuestHomePage />} />
        <Route path="/menu"                     element={<MenuPage />} />
        <Route path="/order/confirm"            element={<OrderConfirmPage />} />
        <Route path="/order/status/:orderId"    element={<OrderStatusPage />} />
        <Route path="/orders/history/:tableId"  element={<OrderHistoryPage />} />
        <Route path="/table/:tableId/summary"   element={<TableSummaryPage />} />

        {/* 관리자용 */}
        <Route path="/admin"                   element={<AdminHomePage />} />
        <Route path="/admin/menus"             element={<AdminPage />} />
        <Route path="/admin/orders"            element={<OrderAdminPage />} />
        <Route path="/admin/tables"            element={<TableAdminSummaryPage />} />

        {/* 나머지 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 관리자 화면에는 숨기기 */}
      {!isAdmin && <CartMiniWidget />}
    </>
  )
}

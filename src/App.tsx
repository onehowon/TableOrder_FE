// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import GuestHomePage      from './pages/GuestHomePage'
import MenuPage           from './pages/MenuPage'
import TableOrderPage     from './pages/TableOrderPage'
import OrderConfirmPage   from './pages/OrderConfirmPage'
import OrderStatusPage    from './pages/OrderStatusPage'
import OrderHistoryPage   from './pages/OrderHistoryPage'
import TableSummaryPage   from './pages/TableSummaryPage'
import CartMiniWidget     from './components/CartMiniWidget'

import AdminHomePage          from './pages/AdminHomePage'
import AdminPage              from './pages/AdminPage'
import OrderAdminPage         from './pages/OrderAdminPage'
import TableAdminSummaryPage  from './pages/TableAdminSummaryPage'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        {/* ── 고객용 ── */}
        <Route path="/"                      element={<GuestHomePage />} />
        <Route path="/:tableId"             element={<TableOrderPage />} />
        <Route path="/menu"                 element={<MenuPage />} />
        <Route path="/order/confirm"        element={<OrderConfirmPage />} />
        <Route path="/order/status/:orderId" element={<OrderStatusPage />} />
        <Route path="/orders/history/:tableId" element={<OrderHistoryPage />} />
        <Route path="/table/:tableId/summary"   element={<TableSummaryPage />} />

        {/* ── 관리자용 ── */}
        <Route path="/admin"            element={<AdminHomePage />} />
        <Route path="/admin/menus"      element={<AdminPage />} />
        <Route path="/admin/orders"     element={<OrderAdminPage />} />
        <Route path="/admin/tables"     element={<TableAdminSummaryPage />} />
        <Route path="/admin/tables/:tableNumber/summary" element={<TableAdminSummaryPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 관리자 영역이 아니면 Cart 미니 위젯 노출 */}
      {!isAdmin && <CartMiniWidget />}
    </>
  )
}

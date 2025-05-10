// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import GuestHomePage        from './pages/GuestHomePage'
import WelcomePage          from './pages/WelcomPage'
import MenuPage             from './pages/MenuPage'
import OrderConfirmPage     from './pages/OrderConfirmPage'
import OrderStatusPage      from './pages/OrderStatusPage'
import MyOrdersPage         from './pages/MyOrdersPage'
import TableSummaryPage     from './pages/TableSummaryPage'
import CartMiniWidget       from './components/CartMiniWidget'

import AdminHomePage            from './pages/AdminHomePage'
import OrderAdminPage           from './pages/OrderAdminPage'
import TableAdminSummaryPage    from './pages/TableAdminSummaryPage'

export default function App() {
  const isAdmin = useLocation().pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        {/* ── 고객용 ── */}
        <Route path="/"                    element={<GuestHomePage />} />
        <Route path="/welcome/:tableId"    element={<WelcomePage />} />
        <Route path="/menu"                element={<MenuPage />} />
        <Route path="/order/confirm"       element={<OrderConfirmPage />} />
        <Route path="/order/status/:orderId" element={<OrderStatusPage />} />
        <Route path="/orders/history"      element={<MyOrdersPage />} />
        <Route path="/table/:tableId/summary" element={<TableSummaryPage />} />

        {/* ── 관리자용 ── */}
        <Route path="/admin"           element={<AdminHomePage />} />
        <Route path="/admin/orders"    element={<OrderAdminPage />} />
        <Route path="/admin/tables"    element={<TableAdminSummaryPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdmin && <CartMiniWidget />}
    </>
  )
}

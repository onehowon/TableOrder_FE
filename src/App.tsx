// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'

import AdminLayout                from './components/layout/AdminLayout'
import OrderAlertPage             from './pages/admin/OrderAlertPage'
import OrderAdminPage             from './pages/admin/OrderAdminPage'
import TableAdminSummaryPage      from './pages/admin/TableAdminSummaryPage'
import StatsPage                  from './pages/admin/StatsPage'
import ErrorBoundary              from './components/ErrorBoundary'
import CustomerLayout        from './pages/customer/CustomerLayout'
import MenuPage              from './pages/customer/MenuPage'
import ConfirmPage           from './pages/customer/ConfirmPage'
import OrderStatusPage       from './pages/customer/OrderStatusPage'
import SummaryPage           from './pages/customer/SummaryPage'
import WelcomePage from './pages/customer/WelcomePage'
import RequestPage from './pages/customer/RequestPage'

export default function App() {
  return (
    <Routes>
      {/* 루트 접근은 어드민 알림으로 */}
      <Route path="/" element={<Navigate to="/admin/alerts" replace />} />

      {/* ── Admin 영역 ── */}
      <Route path="admin/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="alerts" replace />} />
        <Route path="alerts" element={<OrderAlertPage />} />
        <Route path="orders" element={<OrderAdminPage />} />
        <Route path="tables" element={<TableAdminSummaryPage />} />
        <Route path="sales" element={<StatsPage />} />
        {/* Admin 내부 잘못된 경로는 어드민 alerts 로 */}
        <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
      </Route>

      {/* ── Customer 영역 ── */}
      <Route path="customer/:tableNumber/*" element={<CustomerLayout />}>
        <Route index   element={<MenuPage />} />
        <Route path="menu"    element={<MenuPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route path="orders"  element={<OrderStatusPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="request" element={<RequestPage />} />
        {/* Customer 내부 잘못된 경로는 메뉴 페이지로 */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>

      {/* 완전 잘못된 URL 은 어드민 알림으로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}

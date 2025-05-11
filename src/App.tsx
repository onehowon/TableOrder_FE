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
      {/* 루트는 어드민 알림으로 */}
      <Route path="/" element={<Navigate to="/admin/alerts" replace />} />

      {/* ── Admin ── */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="alerts" replace />} />
        <Route path="alerts" element={<ErrorBoundary><OrderAlertPage/></ErrorBoundary>} />
        <Route path="orders" element={<ErrorBoundary><OrderAdminPage/></ErrorBoundary>} />
        <Route path="tables" element={<ErrorBoundary><TableAdminSummaryPage/></ErrorBoundary>} />
        <Route path="sales" element={<ErrorBoundary><StatsPage/></ErrorBoundary>} />
        {/* Admin 내부 잘못된 URL 은 alerts */}
        <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
      </Route>

      {/* ── Customer ── */}
      <Route path="customer/:tableNumber" element={<CustomerLayout />}>
        {/* 진입하면 웰컴 페이지 */}
        <Route index   element={<WelcomePage />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="menu"    element={<MenuPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route path="orders"  element={<OrderStatusPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="request" element={<RequestPage />} />
        {/* Customer 내부 잘못된 URL 은 ‘welcome’ 으로 복귀 */}
        <Route path="*" element={<Navigate to="welcome" replace />} />
      </Route>

      {/* 그 외 전부 어드민 알림으로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}
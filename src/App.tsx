import { Routes, Route, Navigate } from 'react-router-dom'

import AdminLayout           from './components/layout/AdminLayout'
import OrderAlertPage        from './pages/admin/OrderAlertPage'
import TableAdminSummaryPage from './pages/admin/TableAdminSummaryPage'
import StatsPage             from './pages/admin/StatsPage'
import ErrorBoundary         from './components/ErrorBoundary'
import OrderListPage         from './pages/admin/OrderListPage'

// Customer
import CustomerLayout  from './pages/customer/CustomerLayout'
import WelcomePage     from './pages/customer/WelcomePage'
import MenuPage        from './pages/customer/MenuPage'
import ConfirmPage     from './pages/customer/ConfirmPage'
import OrderStatusPage from './pages/customer/OrderStatusPage'
import SummaryPage     from './pages/customer/SummaryPage'
import RequestPage     from './pages/customer/RequestPage'

// 새로 추가된 로그인 페이지
import LoginPage       from './pages/admin/LoginPage'

export default function App() {
  return (
    <Routes>
      {/* ───────────────── Login ───────────────── */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ───────────────── Admin ───────────────── */}
      <Route path="/"      element={<Navigate to="/admin/alerts" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/alerts" replace />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="alerts" replace />} />
        <Route path="alerts" element={<ErrorBoundary><OrderAlertPage/></ErrorBoundary>} />
        <Route path="orders" element={<ErrorBoundary><OrderListPage/></ErrorBoundary>} />
        <Route path="tables" element={<ErrorBoundary><TableAdminSummaryPage/></ErrorBoundary>} />
        <Route path="sales"  element={<ErrorBoundary><StatsPage/></ErrorBoundary>} />
      </Route>

      {/* ───────────────── Customer ───────────────── */}
      <Route path="customer/:tableNumber" element={<CustomerLayout />}>
        <Route index    element={<WelcomePage />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="menu"    element={<MenuPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route path="orders"  element={<OrderStatusPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="request" element={<RequestPage />} />
      </Route>

      {/* 그 외 모두 Admin alerts 로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}

import { Routes, Route, Navigate, useParams} from 'react-router-dom'

import AdminLayout           from './components/layout/AdminLayout'
import OrderAlertPage        from './pages/admin/OrderAlertPage'
import TableAdminSummaryPage from './pages/admin/TableAdminSummaryPage'
import StatsPage             from './pages/admin/StatsPage'
import ErrorBoundary         from './components/ErrorBoundary'
import OrderListPage         from './pages/admin/OrderListPage'
import MenuManagementPage from './pages/admin/MenuManagementPage'

// Customer
import WelcomePage     from './pages/customer/WelcomePage'
import MenuPage        from './pages/customer/MenuPage'
import ConfirmPage     from './pages/customer/ConfirmPage'
import OrderStatusPage from './pages/customer/OrderStatusPage'
import SummaryPage     from './pages/customer/SummaryPage'
import RequestPage     from './pages/customer/RequestPage'
import StartPage from './pages/customer/StartPage'
import OrderPlacedPage        from './pages/customer/OrderPlacedPage'

// 새로 추가된 로그인 페이지
import LoginPage       from './pages/admin/LoginPage'

function RedirectToCustomerIndex() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  return <Navigate to={`/customer/${tableNumber}`} replace />
}

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
        <Route path="menus"  element={<ErrorBoundary><MenuManagementPage/></ErrorBoundary>} />
      </Route>


       {/* Customer (모든 페이지 독립 선언) */}
      <Route path="/customer/:tableNumber"       element={<WelcomePage />} />
      <Route path="/customer/:tableNumber/start" element={<StartPage />} />
      <Route path="/customer/:tableNumber/menu"  element={<MenuPage />} />
      <Route path="/customer/:tableNumber/confirm" element={<ConfirmPage />} />
      <Route path="/customer/:tableNumber/orders"  element={<OrderStatusPage />} />
      <Route path="/customer/:tableNumber/summary" element={<SummaryPage />} />
      <Route path="/customer/:tableNumber/request" element={<RequestPage />} />
      <Route path="/customer/:tableNumber/placed"  element={<OrderPlacedPage />} />

      {/* 잘못된 /customer/:tableNumber/* 경로는 인덱스로 돌려보냄 */}
      <Route
        path="/customer/:tableNumber/*"
        element={<RedirectToCustomerIndex />}
      />

      {/* 그 외 모두 Admin alerts 로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}

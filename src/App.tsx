// src/App.tsx
import { Routes, Route, Navigate, useParams } from 'react-router-dom'

import AdminLayout         from './components/layout/AdminLayout'
import OrderBoardPage      from './pages/admin/OrderBoardPage'
import RequestAlertPage    from './pages/admin/RequestAlertPage'
import StatsPage           from './pages/admin/StatsPage'
import ErrorBoundary       from './components/ErrorBoundary'
import OrderListPage       from './pages/admin/OrderListPage'
import MenuManagementPage  from './pages/admin/MenuManagementPage'

// Customer
import WelcomePage         from './pages/customer/WelcomePage'
import StartPage           from './pages/customer/StartPage'
import MenuPage            from './pages/customer/MenuPage'
import ConfirmPage         from './pages/customer/ConfirmPage'
import OrderStatusPage     from './pages/customer/OrderStatusPage'
import SummaryPage         from './pages/customer/SummaryPage'
import VerifyPage          from './pages/customer/VerifyPage'
import RequestPage         from './pages/customer/RequestPage'
import OrderPlacedPage     from './pages/customer/OrderPlacedPage'
import MenuDetailPage      from './pages/customer/MenuDetailPage'

// Admin 로그인 페이지
import LoginPage           from './pages/admin/LoginPage'

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
      <Route path="/" element={<Navigate to="/admin/requests" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/requests" replace />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        {/* 기본 페이지 */}
        <Route index element={<Navigate to="boards" replace />} />

        {/* 주문 리스트 (boards) */}
        <Route
          path="boards"
          element={
            <ErrorBoundary>
              <OrderListPage />
            </ErrorBoundary>
          }
        />

        {/* 주문 현황 (orders) */}
        <Route path="orders" element={<OrderBoardPage />} />

        {/* 직원 호출 (requests) */}
        <Route path="requests" element={<RequestAlertPage />} />

        {/* 매출 통계 (sales) */}
        <Route
          path="sales"
          element={
            <ErrorBoundary>
              <StatsPage />
            </ErrorBoundary>
          }
        />

        {/* 메뉴 관리 (menus) */}
        <Route
          path="menus"
          element={
            <ErrorBoundary>
              <MenuManagementPage />
            </ErrorBoundary>
          }
        />
      </Route>

      {/* ───────────────── Customer ───────────────── */}
      <Route path="/customer/:tableNumber"         element={<WelcomePage />} />
      <Route path="/customer/:tableNumber/start"   element={<StartPage />} />
      <Route path="/customer/:tableNumber/menu"    element={<MenuPage />} />
      <Route path="/customer/:tableNumber/confirm" element={<ConfirmPage />} />
      <Route path="/customer/:tableNumber/orders"  element={<OrderStatusPage />} />
      <Route path="/customer/:tableNumber/summary" element={<SummaryPage />} />
      <Route path="/customer/:tableNumber/verify"  element={<VerifyPage />} />
      <Route path="/customer/:tableNumber/request" element={<RequestPage />} />
      <Route path="/customer/:tableNumber/placed"  element={<OrderPlacedPage />} />
      <Route
        path="/customer/:tableNumber/menu/:id"
        element={<MenuDetailPage />}
      />
      <Route
        path="/customer/:tableNumber/*"
        element={<RedirectToCustomerIndex />}
      />

      {/* ───────────────── Catch-all ───────────────── */}
      <Route path="*" element={<Navigate to="/admin/requests" replace />} />
    </Routes>
  )
}

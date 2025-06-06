// src/App.tsx
import { Routes, Route, Navigate, useParams } from 'react-router-dom'

import AdminLayout         from './components/layout/AdminLayout'
import OrderBoardPage      from './pages/admin/OrderBoardPage'    // boards
import RequestAlertPage    from './pages/admin/RequestAlertPage'  // alerts
import StatsPage           from './pages/admin/StatsPage'
import ErrorBoundary       from './components/ErrorBoundary'
import OrderListPage       from './pages/admin/OrderListPage'     // orders
import MenuManagementPage  from './pages/admin/MenuManagementPage'
import MenuIntroPage       from './pages/customer/MenuIntroPage'

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
      {/* 로그인 */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* 기본 리다이렉트 */}
      <Route path="/" element={<Navigate to="/admin/alerts" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/alerts" replace />} />

      {/* Admin 영역 */}
      <Route path="/admin/*" element={<AdminLayout />}>
        {/* /admin → /admin/alerts */}
        <Route index element={<Navigate to="alerts" replace />} />

        {/* boards → 주문 현황( OrderBoardPage ) */}
        <Route path="boards" element={<OrderBoardPage />} />

        {/* orders → 주문 리스트( OrderListPage ) */}
        <Route
          path="orders"
          element={
            <ErrorBoundary>
              <OrderListPage />
            </ErrorBoundary>
          }
        />

        {/* alerts → 직원 호출 */}
        <Route path="alerts" element={<RequestAlertPage />} />

        {/* sales → 매출 통계 */}
        <Route
          path="sales"
          element={
            <ErrorBoundary>
              <StatsPage />
            </ErrorBoundary>
          }
        />

        {/* menus → 메뉴 관리 */}
        <Route
          path="menus"
          element={
            <ErrorBoundary>
              <MenuManagementPage />
            </ErrorBoundary>
          }
        />
      </Route>

      <Route path="/customer/menuintro" element={<MenuIntroPage />} />

      {/* Customer 영역 */}
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

      {/* 그 외 모두 /admin/alerts 로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}

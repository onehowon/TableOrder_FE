// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from './components/PageLayout'

import TableOrderPage           from './pages/TableOrderPage'
import WelcomePage             from './pages/WelcomePage'
import GuestHomePage           from './pages/GuestHomePage'
import MenuPage                from './pages/MenuPage'
import OrderConfirmPage        from './pages/OrderConfirmPage'
import OrderStatusPage         from './pages/OrderStatusPage'
import OrderHistoryPage        from './pages/OrderHistoryPage'
import TableSummaryPage        from './pages/TableSummaryPage'

import OrderAdminPage          from './pages/OrderAdminPage'
import TableAdminSummaryPage   from './pages/TableAdminSummaryPage'

export default function App() {
  return (
    <Routes>
      {/** ─── 관리자용 ─── **/}
      {/* /admin → /admin/orders 로 바로 리다이렉트 */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/orders" replace />}
      />
      {/* 주문 리스트 */}
      <Route
        path="/admin/orders"
        element={
          <PageLayout isAdmin>
            <OrderAdminPage />
          </PageLayout>
        }
      />
      {/* 테이블 요약 */}
      <Route
        path="/admin/tables"
        element={
          <PageLayout isAdmin>
            <TableAdminSummaryPage />
          </PageLayout>
        }
      />

      {/** ─── 고객용 ─── **/}
      <Route
        path="/"
        element={
          <PageLayout>
            <GuestHomePage />
          </PageLayout>
        }
      />
      <Route
        path="/welcome"
        element={
          <PageLayout>
            <WelcomePage />
          </PageLayout>
        }
      />
      <Route
        path="/menu"
        element={
          <PageLayout>
            <MenuPage />
          </PageLayout>
        }
      />
      <Route
        path="/order/confirm"
        element={
          <PageLayout>
            <OrderConfirmPage />
          </PageLayout>
        }
      />
      <Route
        path="/order/status/:orderId"
        element={
          <PageLayout>
            <OrderStatusPage />
          </PageLayout>
        }
      />
      <Route
        path="/orders/history/:tableId"
        element={
          <PageLayout>
            <OrderHistoryPage />
          </PageLayout>
        }
      />
      <Route
        path="/table/:tableId/summary"
        element={
          <PageLayout>
            <TableSummaryPage />
          </PageLayout>
        }
      />

      {/** ─── QR 스캔용 (dynamic) ─── **/}
      <Route
        path="/:tableId"
        element={
          <PageLayout>
            <TableOrderPage />
          </PageLayout>
        }
      />

      {/** ─── 그 외는 홈으로 ─── **/}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

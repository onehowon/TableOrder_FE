// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from './components/PageLayout'

// 관리자 페이지 컴포넌트
import OrderAlertPage        from './pages/OrderAlertPage'
import OrderAdminPage        from './pages/OrderAdminPage'
import TableAdminSummaryPage from './pages/TableAdminSummaryPage'
import StatsPage             from './pages/StatsPage'

// 고객 페이지 컴포넌트
import GuestHomePage    from './pages/GuestHomePage'
import WelcomePage      from './pages/WelcomePage'
import MenuPage         from './pages/MenuPage'
import OrderConfirmPage from './pages/OrderConfirmPage'
import OrderStatusPage  from './pages/OrderStatusPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import TableSummaryPage from './pages/TableSummaryPage'
import TableOrderPage   from './pages/TableOrderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/** ─── 관리자용 ─── **/}
        {/* /admin 접속 시 첫 화면을 주문 알림으로 */}
        <Route path="/admin" element={<Navigate to="/admin/alerts" replace />} />

        <Route
          path="/admin/alerts"
          element={
            <PageLayout isAdmin>
              <OrderAlertPage />
            </PageLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <PageLayout isAdmin>
              <OrderAdminPage />
            </PageLayout>
          }
        />

        <Route
          path="/admin/tables"
          element={
            <PageLayout isAdmin>
              <TableAdminSummaryPage />
            </PageLayout>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <PageLayout isAdmin>
              <StatsPage />
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

        {/** ─── QR 스캔용 ─── **/}
        <Route
          path="/:tableId"
          element={
            <PageLayout>
              <TableOrderPage />
            </PageLayout>
          }
        />

        {/** ─── 정의되지 않은 경로는 홈으로 ─── **/}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

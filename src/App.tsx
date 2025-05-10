// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import GuestHomePage from './pages/GuestHomePage'
import MenuPage from './pages/MenuPage'
import TableOrderPage from './pages/TableOrderPage'
import OrderConfirmPage from './pages/OrderConfirmPage'
import OrderStatusPage from './pages/OrderStatusPage'
import OrderHistoryPage from './pages/OrderHistoryPage'        // 고객 주문 내역
import TableSummaryPage from './pages/TableSummaryPage'        // 고객 테이블 요약
import CartMiniWidget from './components/CartMiniWidget'

import AdminHomePage from './pages/AdminHomePage'
import AdminPage from './pages/AdminPage'                      // 메뉴 관리
import OrderAdminPage from './pages/OrderAdminPage'            // 주문 관리
import TableAdminSummaryPage from './pages/TableSummaryPage'   // (관리용) 테이블 요약

function AppRoutes() {
  const location = useLocation()
  // /admin 로 시작하는 경로는 "관리자 영역" 으로 간주
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        {/* ─────────────────────────────────────────── 고객용 ─────────────────────────────────────────── */}
        <Route path="/" element={<GuestHomePage />} />
        {/* QR코드로 들어올 때 /:tableId */}
        <Route path="/:tableId" element={<TableOrderPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order/confirm" element={<OrderConfirmPage />} />
        <Route path="/order/status/:orderId" element={<OrderStatusPage />} />
        {/* 내가 그 테이블에서 주문한 이력 전체 보기 */}
        <Route path="/orders/history/:tableId" element={<OrderHistoryPage />} />
        {/* (고객용) 테이블 요약 보기 */}
        <Route path="/table/:tableId/summary" element={<TableSummaryPage />} />

        {/* ─────────────────────────────────────────── 관리자용 ─────────────────────────────────────────── */}
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/menus" element={<AdminPage />} />
        <Route path="/admin/orders" element={<OrderAdminPage />} />
        <Route path="/admin/tables" element={<TableAdminSummaryPage />} />

        {/* 그 외 모두 루트로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 관리 영역이 아니면 우측 하단에 카트 위젯 노출 */}
      {!isAdmin && <CartMiniWidget />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

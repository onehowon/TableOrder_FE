import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GuestHomePage from './pages/GuestHomePage';
import MenuPage from './pages/MenuPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminPage from './pages/AdminPage';
import OrderAdminPage from './pages/OrderAdminPage';
import TableOrderPage from './pages/TableOrderPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import OrderStatusPage from './pages/OrderStatusPage';
import TableSummaryPage from './pages/TableSummaryPage';
import CartMiniWidget from './components/CartMiniWidget';
import OrderHistoryPage from './pages/OrderHistoryPage';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        {/* 1) QR 코드로 /{tableId} 로 들어올 때 */}
        <Route path="/:tableId" element={<TableOrderPage />} />

        {/* 2) 수동 진입 홈 */}
        <Route path="/" element={<GuestHomePage />} />

        {/* 3) 메뉴 주문 */}
        <Route path="/menu" element={<MenuPage />} />

        {/* 4) 주문 확인 → /order/confirm */}
        <Route path="/order/confirm" element={<OrderConfirmPage />} />

        {/* 5) 주문 상태 확인 (orderId 파라미터) */}
        <Route path="/order/status/:orderId" element={<OrderStatusPage />} />

        {/* 6) 과거 주문 이력 (tableId 파라미터) */}
        <Route path="/orders/history/:tableId" element={<OrderHistoryPage />} />

        {/* 7) 테이블 요약 (tableId 파라미터) */}
        <Route path="/table/:tableId/summary" element={<TableSummaryPage />} />

        {/* 8) 관리자 홈 / 메뉴 관리 / 주문 관리 */}
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/menus" element={<AdminPage />} />
        <Route path="/admin/orders" element={<OrderAdminPage />} />

        {/* 9) 관리자 테이블 요약(목업) */}
        <Route
          path="/admin/tables"
          element={
            <div style={{ padding: 32, textAlign: 'center' }}>
              <h2>테이블 요약 페이지 (목업)</h2>
            </div>
          }
        />

        {/* 10) 그 외 잘못된 URL → / 로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CartMiniWidget />
    </>
  )
}

export default App
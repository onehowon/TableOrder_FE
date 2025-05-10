import { Routes, Route, Navigate } from 'react-router-dom';

import TableOrderPage           from './pages/TableOrderPage';
import GuestHomePage            from './pages/GuestHomePage';
import MenuPage                 from './pages/MenuPage';
import OrderConfirmPage         from './pages/OrderConfirmPage';
import OrderStatusPage          from './pages/OrderStatusPage';
import OrderHistoryPage         from './pages/OrderHistoryPage';
import TableSummaryPage         from './pages/TableSummaryPage';

import AdminHomePage            from './pages/AdminHomePage';
import AdminPage                from './pages/AdminPage';
import OrderAdminPage           from './pages/OrderAdminPage';
import TableAdminSummaryPage    from './pages/TableAdminSummaryPage';

import CartMiniWidget           from './components/CartMiniWidget';
import './App.css';

export default function App() {
  return (
    <>
      <Routes>
        {/* QR 코드로 들어오는 /:tableId → Context에 저장 후 /menu로 */}
        <Route path="/:tableId" element={<TableOrderPage />} />

        {/* 손님용 */}
        <Route path="/"                         element={<GuestHomePage />} />
        <Route path="/menu"                     element={<MenuPage />} />
        <Route path="/order/confirm"            element={<OrderConfirmPage />} />
        <Route path="/order/status/:orderId"    element={<OrderStatusPage />} />
        <Route path="/orders/history/:tableId"  element={<OrderHistoryPage />} />
        <Route path="/table/:tableId/summary"   element={<TableSummaryPage />} />

        {/* 관리자용 */}
        <Route path="/admin"                   element={<AdminHomePage />} />
        <Route path="/admin/menus"             element={<AdminPage />} />
        <Route path="/admin/orders"            element={<OrderAdminPage />} />
        <Route path="/admin/tables"            element={<TableAdminSummaryPage />} />

        {/* 기타 잘못된 경로는 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CartMiniWidget />
    </>
  );
}

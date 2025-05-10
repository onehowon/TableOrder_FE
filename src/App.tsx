import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/PageLayout';

import TableOrderPage from './pages/TableOrderPage';
import WelcomePage from './pages/WelcomePage';
import GuestHomePage from './pages/GuestHomePage';
import MenuPage from './pages/MenuPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import OrderStatusPage from './pages/OrderStatusPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import TableSummaryPage from './pages/TableSummaryPage';

import AdminHomePage from './pages/AdminHomePage';
import AdminPage from './pages/AdminPage';
import OrderAdminPage from './pages/OrderAdminPage';
import TableAdminSummaryPage from './pages/TableAdminSummaryPage';

export default function App() {
  return (
    <Routes>
      {/* QR → Context 세팅 */}
      <Route path="/:tableId" element={
        <PageLayout><TableOrderPage/></PageLayout>
      }/>
      <Route path="/welcome" element={
        <PageLayout><WelcomePage/></PageLayout>
      }/>

      {/* 고객 */}
      <Route path="/" element={<PageLayout><GuestHomePage/></PageLayout>} />
      <Route path="/menu" element={<PageLayout><MenuPage/></PageLayout>} />
      <Route path="/order/confirm" element={<PageLayout><OrderConfirmPage/></PageLayout>} />
      <Route path="/order/status/:orderId" element={<PageLayout><OrderStatusPage/></PageLayout>} />
      <Route path="/orders/history/:tableId" element={<PageLayout><OrderHistoryPage/></PageLayout>} />
      <Route path="/table/:tableId/summary" element={<PageLayout><TableSummaryPage/></PageLayout>} />

      {/* 관리자 */}
      <Route path="/admin" element={<PageLayout isAdmin><AdminHomePage/></PageLayout>} />
      <Route path="/admin/menus" element={<PageLayout isAdmin><AdminPage/></PageLayout>} />
      <Route path="/admin/orders" element={<PageLayout isAdmin><OrderAdminPage/></PageLayout>} />
      <Route path="/admin/tables" element={<PageLayout isAdmin><TableAdminSummaryPage/></PageLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

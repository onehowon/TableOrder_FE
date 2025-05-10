import { Routes, Route, Navigate } from 'react-router-dom'

import TableOrderPage        from './pages/TableOrderPage'
import WelcomePage           from './pages/WelcomePage'
import GuestHomePage         from './pages/GuestHomePage'
import MenuPage              from './pages/MenuPage'
import OrderConfirmPage      from './pages/OrderConfirmPage'
import OrderStatusPage       from './pages/OrderStatusPage'
import OrderHistoryPage      from './pages/OrderHistoryPage'
import TableSummaryPage      from './pages/TableSummaryPage'

import AdminHomePage         from './pages/AdminHomePage'
import AdminPage             from './pages/AdminPage'
import OrderAdminPage        from './pages/OrderAdminPage'
import TableAdminSummaryPage from './pages/TableAdminSummaryPage'

import CartMiniWidget        from './components/CartMiniWidget'
import './App.css'

export default function App() {
  return (
    <>
      <Routes>
        {/* QR → Context 세팅 후 /welcome 로 */}
        <Route path="/:tableId" element={<TableOrderPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* 고객용 */}
        <Route path="/"                       element={<GuestHomePage       />} />
        <Route path="/menu"                   element={<MenuPage            />} />
        <Route path="/order/confirm"          element={<OrderConfirmPage    />} />
        <Route path="/order/status/:orderId"  element={<OrderStatusPage     />} />
        <Route path="/orders/history/:tableId" element={<OrderHistoryPage   />} />
        <Route path="/table/:tableId/summary" element={<TableSummaryPage    />} />

        {/* 관리자용 (네비 버튼 전부 제거) */}
        <Route path="/admin"       element={<AdminHomePage         />} />
        <Route path="/admin/menus" element={<AdminPage             />} />
        <Route path="/admin/orders" element={<OrderAdminPage       />} />
        <Route path="/admin/tables" element={<TableAdminSummaryPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CartMiniWidget />
    </>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import GuestHomePage from './pages/GuestHomePage'
import MenuPage from './pages/MenuPage'
import AdminHomePage from './pages/AdminHomePage'
import AdminPage from './pages/AdminPage'
import OrderAdminPage from './pages/OrderAdminPage'
import TableOrderPage from './pages/TableOrderPage'
import OrderConfirmPage from './pages/OrderConfirmPage'
import OrderStatusPage from './pages/OrderStatusPage'
import TableSummaryPage from './pages/TableSummaryPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import CartMiniWidget from './components/CartMiniWidget'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        {/* QR 경로 (/1, /2 …)  */}
        <Route path='/:tableId' element={<TableOrderPage />} />

        {/* 손님 */}
        <Route path='/' element={<GuestHomePage />} />
        <Route path='/menu' element={<MenuPage />} />
        <Route path='/order/confirm' element={<OrderConfirmPage />} />
        <Route path='/order/status/:orderId' element={<OrderStatusPage />} />
        <Route path='/orders/history/:tableId' element={<OrderHistoryPage />} />
        <Route path='/table/:tableId/summary' element={<TableSummaryPage />} />

        {/* 관리자 */}
        <Route path='/admin' element={<AdminHomePage />} />
        <Route path='/admin/menus' element={<AdminPage />} />
        <Route path='/admin/orders' element={<OrderAdminPage />} />
        <Route
          path='/admin/tables'
          element={
            <div style={{ padding: 32, textAlign: 'center' }}>
              <h2>테이블 요약 페이지 (목업)</h2>
            </div>
          }
        />

        {/* 잘못된 경로 */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <CartMiniWidget />
    </>
  )
}

export default App

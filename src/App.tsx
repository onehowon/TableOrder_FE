import { Routes, Route, Navigate, useParams} from 'react-router-dom'


import AdminLayout           from './components/layout/AdminLayout'
import OrderBoardPage   from './pages/admin/OrderBoardPage'
import RequestAlertPage from './pages/admin/RequestAlertPage'
import StatsPage             from './pages/admin/StatsPage'
import ErrorBoundary         from './components/ErrorBoundary'
import OrderListPage         from './pages/admin/OrderListPage'
import MenuManagementPage from './pages/admin/MenuManagementPage'

// Customer
import WelcomePage     from './pages/customer/WelcomePage'
import MenuPage        from './pages/customer/MenuPage'
import ConfirmPage     from './pages/customer/ConfirmPage'
import OrderStatusPage from './pages/customer/OrderStatusPage'
import SummaryPage     from './pages/customer/SummaryPage'
import RequestPage     from './pages/customer/RequestPage'
import StartPage from './pages/customer/StartPage'
import OrderPlacedPage        from './pages/customer/OrderPlacedPage'
import VerifyPage from './pages/customer/VerifyPage'
import MenuDetailPage from './pages/customer/MenuDetailPage'

// 새로 추가된 로그인 페이지
import LoginPage       from './pages/admin/LoginPage'

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
      <Route path="/"      element={<Navigate to="/admin/alerts" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/alerts" replace />} />
      <Route path="/admin/*" element={<AdminLayout />}>
      <Route index element={<Navigate to="boards" replace />} />
        <Route path="orders" element={<ErrorBoundary><OrderListPage/></ErrorBoundary>} />
        <Route path="/admin/orders" element={<OrderBoardPage />} />
        <Route path="/admin/requests" element={<RequestAlertPage />} />
        <Route path="sales"  element={<ErrorBoundary><StatsPage/></ErrorBoundary>} />
        <Route path="menus"  element={<ErrorBoundary><MenuManagementPage/></ErrorBoundary>} />
      </Route>


       {/* Customer (모든 페이지 독립 선언) */}
      <Route path="/customer/:tableNumber"       element={<WelcomePage />} />
      <Route path="/customer/:tableNumber/start" element={<StartPage />} />
      <Route path="/customer/:tableNumber/menu"  element={<MenuPage />} />
      <Route path="/customer/:tableNumber/confirm" element={<ConfirmPage />} />
      <Route path="/customer/:tableNumber/orders"  element={<OrderStatusPage />} />
      <Route path="/customer/:tableNumber/summary" element={<SummaryPage />} />
      <Route path="/customer/:tableNumber/verify" element={<VerifyPage />} />
      <Route path="/customer/:tableNumber/request" element={<RequestPage />} />
      <Route path="/customer/:tableNumber/placed"  element={<OrderPlacedPage />} />
      <Route path="/customer/:tableNumber/menu/:id" element={<MenuDetailPage />}/>

      {/* 잘못된 /customer/:tableNumber/* 경로는 인덱스로 돌려보냄 */}
      <Route
        path="/customer/:tableNumber/*"
        element={<RedirectToCustomerIndex />}
      />

      {/* 그 외 모두 Admin alerts 로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}

// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'

import AdminLayout                from './components/layout/AdminLayout'
import OrderAlertPage             from './pages/admin/OrderAlertPage'
import OrderAdminPage             from './pages/admin/OrderAdminPage'
import TableAdminSummaryPage      from './pages/admin/TableAdminSummaryPage'
import StatsPage                  from './pages/admin/StatsPage'
import ErrorBoundary              from './components/ErrorBoundary'

export default function App() {
  return (
    <Routes>
      {/* 루트와 /admin 은 Alerts로 */}
      <Route path="/"      element={<Navigate to="/admin/alerts" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/alerts" replace />} />

      {/* AdminLayout 안에만 4개 라우트 */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="alerts" replace />} />

        <Route
          path="alerts"
          element={
            <ErrorBoundary>
              <OrderAlertPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="orders"
          element={
            <ErrorBoundary>
              <OrderAdminPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="tables"
          element={
            <ErrorBoundary>
              <TableAdminSummaryPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="sales"
          element={
            <ErrorBoundary>
              <StatsPage />
            </ErrorBoundary>
          }
        />
      </Route>

      {/* 그 외 전부 Alerts로 */}
      <Route path="*" element={<Navigate to="/admin/alerts" replace />} />
    </Routes>
  )
}

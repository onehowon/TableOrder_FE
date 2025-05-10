import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ─ 고객용 ────────────────────────────────────────────────────────────

// 메뉴 조회
export const getCustomerMenus = () => api.get('/customer/menus');
// 주문 생성
export const createOrder = (payload: {
  tableNumber: number;
  items: { menuId: number; quantity: number }[];
}) => api.post('/customer/orders', payload);
// 테이블별 주문 조회
export const getOrdersByTable = (tableNumber: string) =>
  api.get(`/customer/orders/table/${tableNumber}`);
// 단일 주문 상태 조회
export const getOrderStatus = (orderId: string) =>
  api.get(`/customer/orders/${orderId}`);
// 테이블 요약 조회
export const getTableSummary = (tableNumber: string) =>
  api.get(`/customer/tables/${tableNumber}/summary`);
// 편의 요청 전송
export const postCustomerRequest = (payload: {
  tableNumber: number;
  type: 'WATER' | 'TISSUE' | 'CALL';
}) => api.post('/customer/requests', payload);

// ─ 관리자용 ────────────────────────────────────────────────────────

// 메뉴 CRUD
export const getAdminMenus = () => api.get('/admin/menus');
export const createAdminMenu = (fd: FormData) =>
  api.post('/admin/menus', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAdminMenu = (id: number, fd: FormData) =>
  api.put(`/admin/menus/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAdminMenu = (id: number) => api.delete(`/admin/menus/${id}`);
export const activateAdminMenu = (id: number) => api.put(`/admin/menus/${id}/activate`);
export const deactivateAdminMenu = (id: number) => api.put(`/admin/menus/${id}/deactivate`);

// 주문 관리
export const getAdminOrders = () => api.get('/admin/orders');
export const updateAdminOrderStatus = (orderId: number, status: string, eta?: number) =>
  api.put(`/admin/orders/${orderId}/status`, { status, estimatedTime: eta });

// 매출 / 테이블 요약
export const getTodaySalesSummary = () => api.get('/admin/orders/today-summary');
export const getAdminTableSummary = (table: number) =>
  api.get(`/admin/tables/summary?table=${table}`);
export const getAllAdminTableSummaries = () =>
  api.get('/admin/tables/summary-all');

// 관리자 편의 요청
export const postAdminRequest = (payload: { tableNumber: number; type: string }) =>
  api.post('/admin/requests', payload);

export default api;
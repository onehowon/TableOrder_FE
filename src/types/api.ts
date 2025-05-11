// src/api.ts
import axios from 'axios'

// 🚀 Axios 인스턴스
const api = axios.create({
  baseURL: '/admin',           // 공통 경로
  headers: { 'Content-Type': 'application/json' },
})

// ─── 타입 정의 ────────────────────────────────────────────────────────────

// 주문 알림
export interface OrderAlertDTO {
  tableNumber: number;
  items: { menuName: string; quantity: number }[];
  createdAt: string;
}

// 주문 상세
export interface OrderDetailDTO {
  orderId: number;
  tableNumber: number;
  items: { menuName: string; quantity: number; price: number }[];
  status: string;
  orderedAt: string;
  estimatedAt?: string;
}

// 테이블 요약
export interface TableSummaryResponse {
  tableNumber: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
}

// 매출 통계
export interface SalesStatsDTO {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  hourly: { hour: number; revenue: number }[];
}

// 메뉴
export interface MenuDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
}

// ─── API 호출 함수 ───────────────────────────────────────────────────────

// 1) 주문 알림
export const fetchAlerts = () =>
  api.get<{ data: OrderAlertDTO[] }>('/alerts')

// 2) 오늘 주문 리스트
export const fetchOrders = () =>
  api.get<{ data: OrderDetailDTO[] }>('/orders')

// 3) 테이블 요약
export const fetchTableSummary = (tableNumber: number) =>
  api.get<{ data: TableSummaryResponse }>(`/tables/${tableNumber}/summary`)

// 4) 매출 통계
export const fetchStats = () =>
  api.get<{ data: SalesStatsDTO }>('/sales')

// 5) 메뉴 목록
export const fetchMenus = () =>
  api.get<{ data: MenuDTO[] }>('/menus')

// 6) 메뉴 생성
export const createMenu = (formData: FormData) =>
  api.post<{ data: MenuDTO }>('/menus', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// 7) 메뉴 수정
export const updateMenu = (id: number, formData: FormData) =>
  api.put<{ data: MenuDTO }>(`/menus/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// 8) 메뉴 활성화/비활성화, 삭제
export const deactivateMenu = (id: number) =>
  api.put<void>(`/menus/${id}/deactivate`)

export const activateMenu = (id: number) =>
  api.put<void>(`/menus/${id}/activate`)

export const deleteMenu = (id: number) =>
  api.delete<void>(`/menus/${id}`)

export default api

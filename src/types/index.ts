// src/types/index.ts

export interface OrderDetailDTO {
  id: number
  tableNumber: number
  totalAmount: number
  status: 'CREATED' | 'COOKING' | 'SERVED'
  items: { menuName: string; quantity: number }[]
}

export interface TableSummaryDTO {
  tableNumber: number
  totalAmount: number
  items: { menuName: string; quantity: number }[]
}

// 관리자 주문 알림용 타입
export interface OrderAlertDTO {
  tableNumber: number
  items: AlertItem[]
  createdAt: string  // ISO 문자열
}

export interface AlertItem {
  menuName: string
  quantity: number
}

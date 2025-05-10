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

// ← 이 부분이 반드시 있어야 합니다!
export interface OrderAlertDTO {
  tableNumber: number
  items: AlertItem[]
  createdAt: string
}

export interface AlertItem {
  menuName: string
  quantity: number
}

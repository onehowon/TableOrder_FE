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
  
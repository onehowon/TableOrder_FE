// src/components/GlobalNotifier.tsx
import { useEffect, useRef } from 'react'
import { listOrdersAdmin } from '@/api'
import { listRequestsAdmin } from '@/api'

const ORDER_SOUND = new Audio('/sounds/baedalyi-minjog.mp3')
const REQUEST_SOUND = new Audio('/sounds/choinjong.mp3')

export default function GlobalNotifier() {
  const prevOrderIds = useRef<Set<number>>(new Set())
  const prevReqIds   = useRef<Set<number>>(new Set())

  const checkNotifications = async () => {
    try {
      // — 주문 체크
      const ordRes  = await listOrdersAdmin()
      const orders  = ordRes.data.data.filter(o => o.status !== 'DELETED')
      const orderIds = new Set(orders.map(o => o.orderId))
      if ([...orderIds].some(id => !prevOrderIds.current.has(id))) {
        ORDER_SOUND.play().catch(() => {})
      }
      prevOrderIds.current = orderIds

      // — 호출 체크
      const reqRes   = await listRequestsAdmin()
      const reqs     = reqRes.data.data
      const reqIds   = new Set(reqs.map(r => r.id))
      if ([...reqIds].some(id => !prevReqIds.current.has(id))) {
        REQUEST_SOUND.play().catch(() => {})
      }
      prevReqIds.current = reqIds

    } catch (e) {
      console.error('GlobalNotifier 오류', e)
    }
  }

  useEffect(() => {
    checkNotifications()                // 첫 로드
    const iv = setInterval(checkNotifications, 5000)
    return () => clearInterval(iv)
  }, [])

  return null
}

// src/components/GlobalNotifier.tsx
import { useEffect, useRef } from 'react'
import { listOrdersAdmin } from '@/api'
import { listRequestsAdmin } from '@/api'

export default function GlobalNotifier() {
  const orderSound = useRef<HTMLAudioElement>(new Audio('/sounds/baedalyi-minjog.mp3'))
  const requestSound = useRef<HTMLAudioElement>(new Audio('/sounds/choinjong.mp3'))
  const prevOrderIds = useRef<Set<number>>(new Set())
  const prevReqIds   = useRef<Set<number>>(new Set())

  useEffect(() => {
    // 1) 터치 또는 클릭 이벤트로 한 번만 오디오 컨텍스트 unlock (muted 재생)
    const unlock = () => {
      orderSound.current.muted = true
      requestSound.current.muted = true

      orderSound.current.play()
        .then(() => {
          orderSound.current.pause()
          orderSound.current.muted = false
        })
        .catch(() => {})

      requestSound.current.play()
        .then(() => {
          requestSound.current.pause()
          requestSound.current.muted = false
        })
        .catch(() => {})

      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('click', unlock)
    window.addEventListener('touchstart', unlock)

    // 2) 실제 폴링 & 알림 로직
    const checkNotifications = async () => {
      try {
        // — 주문 체크
        const ordRes = await listOrdersAdmin()
        const orders = ordRes.data.data.filter(o => o.status !== 'DELETED')
        const newOrderIds = new Set(orders.map(o => o.orderId))
        if ([...newOrderIds].some(id => !prevOrderIds.current.has(id))) {
          orderSound.current.play().catch(() => {})
        }
        prevOrderIds.current = newOrderIds

        // — 호출 체크
        const reqRes = await listRequestsAdmin()
        const reqs = reqRes.data.data
        const newReqIds = new Set(reqs.map(r => r.id))
        if ([...newReqIds].some(id => !prevReqIds.current.has(id))) {
          requestSound.current.play().catch(() => {})
        }
        prevReqIds.current = newReqIds

      } catch (e) {
        console.error('GlobalNotifier 오류', e)
      }
    }

    // 즉시 실행 & 5초마다 반복
    checkNotifications()
    const iv = setInterval(checkNotifications, 5000)
    return () => {
      clearInterval(iv)
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])

  return null
}

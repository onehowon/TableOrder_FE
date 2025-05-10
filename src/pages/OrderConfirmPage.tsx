import PageWrapper from '../components/PageWrapper'
import api         from '../api'
import { useNavigate } from 'react-router-dom'

export default function OrderConfirmPage() {
  const nav = useNavigate()

  const onConfirm = async () => {
    try {
      await api.post('/customer/orders', {})
      alert('주문이 완료되었습니다! 홈으로 이동합니다.')
      nav('/')
    } catch {
      alert('주문 실패! 다시 시도해주세요.')
    }
  }

  return (
    <PageWrapper title="주문 확인">
      {/* 주문 내역 요약 ... */}
      <button onClick={onConfirm} className="btn-primary">
        주문 완료
      </button>
    </PageWrapper>
  )
}

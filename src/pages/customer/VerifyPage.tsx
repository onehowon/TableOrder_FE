// src/pages/customer/VerifyPage.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { listAllMenus, postOrder } from '@/api'
import type { MenuDTO } from '@/api'
import logoSrc from '@/assets/engine.png'

type CartState = Record<number, number>
interface LocationState { cart?: CartState }

export default function VerifyPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  // SummaryPage에서 넘긴 cart
  const passedCart = (location.state as LocationState)?.cart
  if (!passedCart) {
    // 잘못된 접근 시 뒤로
    navigate(-1)
    return null
  }

  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputsRef = useRef<HTMLInputElement[]>([])

  const ADMIN_CODE = '4132'

  // 메뉴 불러와서 subtotal 계산용
  useEffect(() => {
    listAllMenus()
      .then(res => setMenus(res.data.data.filter(m => m.isAvailable)))
      .catch(() => alert('메뉴 로딩에 실패했습니다.'))
  }, [])

  // cart에 담긴 아이템만
  const items = menus
    .filter(m => passedCart[m.id] != null)
    .map(m => ({
      menuId: m.id,
      quantity: passedCart[m.id]!,
    }))

  const totalAmount = menus
    .filter(m => passedCart[m.id] != null)
    .reduce((sum, m) => sum + m.price * passedCart[m.id]!, 0)

  // 입력 칸 하나 바뀔 때
  const onDigitChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...code]
    next[i] = v
    setCode(next)
    if (v && inputsRef.current[i + 1]) {
      inputsRef.current[i + 1].focus()
    }
  }

  // 검증 후 주문 API 호출
  const handleVerify = async () => {
    if (isSubmitting) return

    if (code.join('') !== ADMIN_CODE) {
      setError('코드가 틀렸습니다. 다시 입력해 주세요.')
      // 입력란 초기화
      setCode(['', '', '', ''])
      // 첫번째 칸에 포커스
      inputsRef.current[0]?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      await postOrder({
        tableNumber: Number(tableNumber),
        items,
      })
      navigate(`/customer/${tableNumber}/placed`, { replace: true })
    } catch {
      alert('주문 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center p-4 font-woowahan">
      {/* 로고 */}
      <img
        src={logoSrc}
        alt="EngiNE"
        className="h-12 object-contain mb-6"
      />

      {/* 금액 & 계좌 */}
      <div className="text-lg mb-2 font-semibold">
        총 금액 : {totalAmount.toLocaleString()}원
      </div>
      <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-8 text-center">
        계좌번호: 카카오뱅크 3333-27-0930198 (한원보)
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-2xl md:text-3xl font-bold mb-8 leading-snug">
        이체 후 직원에게<br/> 보여주세요.
      </p>

      {/* 코드 입력 */}
      <div className="flex items-center">
        {code.map((d, i) => (
          <input
            key={i}
            ref={el => { if (el) inputsRef.current[i] = el }}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={d}
            onChange={e => onDigitChange(i, e.target.value)}
            className={`
              w-12 h-12 mx-1 text-center text-2xl rounded-md focus:outline-none transition-colors
              ${d
                ? 'bg-green-600 text-transparent border border-transparent'
                : 'bg-white text-gray-800 border border-gray-300'
              }
            `}
          />
        ))}
        <button
          onClick={handleVerify}
          disabled={isSubmitting}
          className={`
            ml-4 text-3xl font-bold text-green-600 hover:text-green-800 transition
            ${isSubmitting ? 'opacity-50 cursor-not-allowed hover:text-green-600' : ''}
            font-sans 
          `}
        >
          →
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  )
}

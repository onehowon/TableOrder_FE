import { useState }           from 'react';
import { useCart }                   from '../contexts/CartContext';
import { useTable }                  from '../contexts/TableContext';
import { useNavigate }               from 'react-router-dom';
import api                           from '../api';

export default function OrderConfirmPage() {
  const { cart, clearCart } = useCart();
  const { tableId }         = useTable();
  const navigate            = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleOrder = async () => {
    setError(null);
    if (!tableId) {
      setError('테이블 정보가 없습니다.');
      return;
    }
    if (cart.length === 0) {
      setError('장바구니가 비어 있습니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/customer/orders', {
        tableNumber: Number(tableId),
        items: cart.map(i => ({ menuId: i.menuId, quantity: i.quantity }))
      });
      const orderId = res.data.data.orderId;
      if (!orderId) {
        setError('주문 아이디를 받지 못했습니다.');
        return;
      }
      clearCart();
      navigate(`/order/status/${orderId}`);
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
        '주문에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-4 max-w-lg mx-auto sm:px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">주문 확인</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="flex flex-col gap-4 mb-6">
          {cart.map(item => (
            <li
              key={item.menuId}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between gap-3"
            >
              <div>
                <b className="block text-lg mb-1">{item.name}</b>
                <span className="text-blue-700 font-semibold">
                  {item.price.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>× {item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="font-bold text-lg mb-6 text-right">
        합계: {total.toLocaleString()}원
      </div>
      <button
        onClick={handleOrder}
        disabled={loading || cart.length === 0}
        className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-600 transition disabled:opacity-50"
      >
        {loading ? '주문 중...' : '주문하기'}
      </button>
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
}

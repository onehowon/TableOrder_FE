import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirmPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    setError(null);
    if (cart.length === 0) {
      setError('장바구니가 비어 있습니다.');
      return;
    }
    setLoading(true);
    try {
      // tableNumber로 변경 (기존 tableId)
      const res = await api.post('/customer/orders', {
        tableNumber: 1,
        items: cart.map(item => ({ menuId: item.menuId, quantity: item.quantity }))
      });
      clearCart();
      const orderId = res.data.data.id;
      navigate(`/order/status/${orderId}`);
    } catch (e) {
      setError('주문에 실패했습니다. 다시 시도해주세요.');
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
            <li key={item.menuId} className="bg-white rounded-xl shadow p-4 flex items-center justify-between gap-3">
              <div>
                <b className="block text-lg mb-1">{item.name}</b>
                <span className="text-blue-700 font-semibold">{item.price.toLocaleString()}원</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.menuId, Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => removeItem(item.menuId)}
                  className="text-red-500 bg-transparent border-none px-2 py-1 rounded hover:bg-red-100 transition"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="font-bold text-lg mb-6 text-right">합계: {total.toLocaleString()}원</div>
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
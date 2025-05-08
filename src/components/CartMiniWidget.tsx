import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartMiniWidget() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div
      onClick={() => navigate('/order/confirm')}
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        background: '#2563eb',
        color: 'white',
        borderRadius: 32,
        padding: '16px 32px',
        fontSize: 18,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <span role="img" aria-label="cart" style={{ fontSize: 22 }}>🛒</span>
      <span> {itemCount}개 | {total.toLocaleString()}원 </span>
    </div>
  );
} 
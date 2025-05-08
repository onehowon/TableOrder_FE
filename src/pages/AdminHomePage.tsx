import { useNavigate } from 'react-router-dom';

export default function AdminHomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <h1 style={{ fontSize: 32, marginBottom: 40 }}>관리자 홈</h1>
      <button onClick={() => navigate('/admin/menus')} style={{ fontSize: 20, padding: '20px 40px', marginBottom: 24, borderRadius: 8, border: '1px solid #2563eb', background: '#2563eb', color: 'white', cursor: 'pointer' }}>
        메뉴 관리
      </button>
      <button onClick={() => navigate('/admin/orders')} style={{ fontSize: 20, padding: '20px 40px', marginBottom: 24, borderRadius: 8, border: '1px solid #22c55e', background: '#22c55e', color: 'white', cursor: 'pointer' }}>
        주문 관리
      </button>
      <button onClick={() => navigate('/admin/tables')} style={{ fontSize: 20, padding: '20px 40px', borderRadius: 8, border: '1px solid #f59e42', background: '#f59e42', color: 'white', cursor: 'pointer' }}>
        테이블 요약
      </button>
    </div>
  );
} 
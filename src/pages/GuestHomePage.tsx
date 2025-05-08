import { useNavigate } from 'react-router-dom';

export default function GuestHomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <h1 style={{ fontSize: 32, marginBottom: 40 }}>손님 홈</h1>
      <button onClick={() => navigate('/menu')} style={{ fontSize: 20, padding: '20px 40px', marginBottom: 24, borderRadius: 8, border: '1px solid #2563eb', background: '#2563eb', color: 'white', cursor: 'pointer' }}>
        메뉴 주문하기
      </button>
      <button onClick={() => navigate('/table-order')} style={{ fontSize: 20, padding: '20px 40px', borderRadius: 8, border: '1px solid #22c55e', background: '#22c55e', color: 'white', cursor: 'pointer' }}>
        테이블 주문 내역 조회
      </button>
    </div>
  );
} 
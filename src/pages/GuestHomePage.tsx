
import { Link } from 'react-router-dom';

export default function GuestHomePage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 16,
        textAlign: 'center'
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
        잘못된 접근입니다
      </h1>
      <p style={{ fontSize: 16, color: '#666' }}>
        테이블 위 QR 코드를 스캔하여 접속해 주세요.
      </p>
      <Link
        to="/"
        style={{
          marginTop: 24,
          padding: '8px 16px',
          background: '#2563eb',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none'
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

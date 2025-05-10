import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminHomePage() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 24, marginBottom: 24 }}>관리자 홈</h2>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <li><Link to="/admin/menus">메뉴 관리</Link></li>
        <li><Link to="/admin/orders">주문 관리</Link></li>
        <li><Link to="/admin/tables">테이블 요약</Link></li>
      </ul>
    </div>
  );
}

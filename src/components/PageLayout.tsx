import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from '../contexts/TableContext';

export default function PageLayout({
  children,
  isAdmin = false
}: {
  children: ReactNode;
  isAdmin?: boolean;
}) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { tableId } = useTable();

  // 뒤로가기 제외 경로
  const noBack = isAdmin
    ? ['/admin']
    : ['/', '/welcome'];

  const goHome = () => {
    if (isAdmin) nav('/admin');
    else if (tableId) nav('/welcome');
    else nav('/');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="flex items-center gap-2 p-4 bg-zinc-800">
        {!noBack.includes(pathname) && (
          <button
            onClick={() => nav(-1)}
            className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
          >
            ← 뒤로
          </button>
        )}
        <button
          onClick={goHome}
          className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
        >
          홈
        </button>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}

// src/components/PageWrapper.tsx
import SideNav from './SideNav';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />
      <div className="flex-1 overflow-y-auto">
        {/* Optional: top header */}
        <header className="px-6 py-4 border-b bg-white">
          <button className="mr-4 lg:hidden">
            {/* 햄버거 아이콘 */}
            <svg width="24" height="24" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

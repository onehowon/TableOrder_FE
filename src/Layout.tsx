import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function Layout() {
  const nav = useNavigate()
  const loc = useLocation()
  const hideBack = ['/', '/welcome'].includes(loc.pathname)

  return (
    <div className="min-h-screen bg-zinc-900 text-white pb-28">
      {!hideBack && (
        <header className="fixed top-0 inset-x-0 h-12 bg-zinc-950/80
                           backdrop-blur flex items-center px-4 z-40">
          <button onClick={()=>nav(-1)} className="text-xl">←</button>
        </header>
      )}
      <main className={`${hideBack ? '' : 'pt-14'}`}>
        <Outlet/>
      </main>
    </div>
  )
}

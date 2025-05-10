// src/main.tsx
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'


// 전역 스타일(꼭 이 파일을 불러와야 Tailwind가 적용됩니다)


import App from './App'

// (기존에 App.css 같은 게 있다면 모두 지우셔도 무방합니다)
// import './App.css'

import { TableProvider } from './contexts/TableContext'
import { CartProvider }  from './contexts/CartContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TableProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </TableProvider>
  </React.StrictMode>
)

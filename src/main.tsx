import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { CartProvider } from './contexts/CartContext'
import { TableProvider } from './contexts/TableContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <TableProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TableProvider>
    </CartProvider>
  </React.StrictMode>,
)
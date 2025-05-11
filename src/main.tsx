import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { TableProvider } from '@/contexts/TableContext'
import { CartProvider }  from '@/contexts/CartContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
     <TableProvider>
       <CartProvider>
         <App />
       </CartProvider>
     </TableProvider>
    </BrowserRouter>
  </React.StrictMode>
)
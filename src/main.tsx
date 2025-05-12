import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { TableProvider } from '@/contexts/TableContext'
import { CartProvider }  from '@/contexts/CartContext'
import adminApi from '@/api'

const savedToken = localStorage.getItem('accessToken')
if (savedToken) {
  adminApi.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

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
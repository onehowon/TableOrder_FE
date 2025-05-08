import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  menuId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.menuId === item.menuId);
      if (exists) {
        return prev.map(i => i.menuId === item.menuId ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
  };

  const removeItem = (menuId: number) => {
    setCart(prev => prev.filter(i => i.menuId !== menuId));
  };

  const updateQuantity = (menuId: number, quantity: number) => {
    setCart(prev => prev.map(i => i.menuId === menuId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
} 
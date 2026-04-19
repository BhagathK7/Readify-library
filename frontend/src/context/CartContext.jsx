// frontend/src/context/CartContext.jsx
import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

const CART_KEY = 'readify_cart_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (book, qty = 1) => {
    setItems(prev => {
      const found = prev.find(i => i.book === book._id);
      if (found) {
        return prev.map(i => i.book === book._id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { book: book._id, title: book.title, price: book.price, coverImage: book.coverImage, qty }];
    });
  };

  const updateQty = (bookId, qty) => {
    setItems(prev => prev.map(i => i.book === bookId ? { ...i, qty } : i));
  };

  const removeFromCart = (bookId) => {
    setItems(prev => prev.filter(i => i.book !== bookId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

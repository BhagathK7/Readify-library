// frontend/src/components/CartPreview.jsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPreview() {
  const { items, total } = useContext(CartContext);
  return (
    <div className="cart-preview">
      <div><strong>Cart</strong></div>
      <div>{items.length} items</div>
      <div>Total: ₹{total.toFixed(2)}</div>
      <Link to="/cart" className="btn-primary">View Cart</Link>
    </div>
  );
}

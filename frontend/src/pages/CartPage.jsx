// frontend/src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQty, removeFromCart, total } = useContext(CartContext);
  const navigate = useNavigate();

  const goCheckout = () => {
    navigate('/checkout');
  };

  if (!items.length) {
    return (
      <div className="content-card">
        <h2>Your cart is empty</h2>
        <Link to="/books" className="btn-primary">Browse Books</Link>
      </div>
    );
  }

  const subtotal = total;
  const shipping = 4.99;
  const discount = 5.00;
  const estimatedTotal = subtotal + shipping - discount;

  return (
    <div className="content-card cart-page">
      <h2>Your Cart ({items.length} items)</h2>
      <div className="cart-grid">
        <div className="cart-items">
          {items.map(i => (
            <div className="cart-item" key={i.book}>
              <img src={i.coverImage || 'https://via.placeholder.com/80'} alt={i.title} />
              <div className="item-details">
                <div className="book-title">{i.title}</div>
                <div className="item-price">₹{i.price.toFixed(2)}</div>
                <div className="item-qty-control">
                  <button className="btn-ghost" onClick={() => updateQty(i.book, Math.max(1, i.qty - 1))}>-</button>
                  <span>{i.qty}</span>
                  <button className="btn-ghost" onClick={() => updateQty(i.book, i.qty + 1)}>+</button>
                </div>
              </div>
              <button className="btn-ghost remove-btn" onClick={() => removeFromCart(i.book)}>Remove</button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-item"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="summary-item"><span>Shipping:</span><span>₹{shipping.toFixed(2)}</span></div>
          <div className="summary-item"><span>Discount:</span><span>-₹{discount.toFixed(2)}</span></div>
          <div className="summary-total"><span>Estimated Total:</span><span>₹{estimatedTotal.toFixed(2)}</span></div>
          <button className="btn-primary" onClick={goCheckout}>Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  );
}
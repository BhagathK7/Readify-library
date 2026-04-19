// frontend/src/pages/Checkout.jsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { fetchJSON } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);

  const onProceed = async (e) => {
    e.preventDefault();
    if (!items.length) return alert('Cart empty');

    try {
      setLoading(true);

      const create = await fetchJSON('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items,
          shippingAddress: address
        })
      });

      const rzp = new window.Razorpay({
        key: create.razorpayKeyId,
        amount: create.amount,
        currency: create.currency,
        name: 'Readify',
        description: `Order ${create.orderId}`,
        order_id: create.razorpayOrderId,

        handler: async (response) => {
          await fetchJSON('/orders/verify', {
            method: 'POST',
            body: JSON.stringify({
              orderId: create.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            })
          });

          alert('Payment successful!');
          clearCart();
          navigate('/dashboard');
        }
      });

      rzp.open();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = total;
  const shipping = 4.99;
  const tax = subtotal * 0.05;
  const totalPrice = subtotal + shipping + tax;

  return (
    <div className="checkout-container">
      
      {/* LEFT: FORM */}
      <form className="checkout-form" onSubmit={onProceed}>
        <h2>Shipping Details</h2>

        <input placeholder="Full Name" required
          value={address.fullName}
          onChange={(e)=>setAddress({...address, fullName:e.target.value})}
        />

        <input placeholder="Address" required
          value={address.address}
          onChange={(e)=>setAddress({...address, address:e.target.value})}
        />

        <div className="row">
          <input placeholder="City" required
            value={address.city}
            onChange={(e)=>setAddress({...address, city:e.target.value})}
          />

          <input placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e)=>setAddress({...address, postalCode:e.target.value})}
          />
        </div>

        <input placeholder="Country"
          value={address.country}
          onChange={(e)=>setAddress({...address, country:e.target.value})}
        />

        <button className="btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {/* RIGHT: SUMMARY */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>

        <div className="summary-item">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-item">
          <span>Shipping</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>

        <div className="summary-item">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}
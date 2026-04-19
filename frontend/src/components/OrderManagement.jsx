// frontend/src/components/OrderManagement.jsx

import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../utils/api';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusOptions] = useState(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchJSON('/admin/orders');
      setOrders(res);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetchJSON(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      alert('Order status updated!');
      fetchOrders(); // Refresh the list
    } catch (e) {
      alert('Failed to update order status.');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="content-card">
      <h2>Order Management</h2>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>#{o._id.substring(18)}</td>
                <td>{o.user?.name || 'N/A'}</td>
                <td>₹{o.totalPrice}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  {/* You can add more actions here if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
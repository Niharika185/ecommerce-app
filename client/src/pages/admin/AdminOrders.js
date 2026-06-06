import React, { useState, useEffect } from 'react';
import API from '../../api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/all');
      setOrders(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setMessage('✅ Order status updated!');
      fetchOrders();
    } catch (err) {
      setMessage('❌ Update failed');
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2>Manage Orders</h2>
      {message && <p style={styles.message}>{message}</p>}
      {orders.length === 0 ? (
        <p>No orders yet!</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.header}>
              <div>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
              </div>
              <div>
                <p><strong>Total: ₹{order.totalAmount}</strong></p>
                <select
                  style={styles.select}
                  value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={styles.products}>
              <strong>Products:</strong>
              {order.products.map((item, index) => (
                <div key={index} style={styles.productItem}>
                  <span>{item.product?.name || 'Product'}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    marginTop: '10px',
    cursor: 'pointer'
  },
  products: {
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    padding: '10px',
    marginTop: '10px'
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px solid #eee'
  },
  message: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    marginBottom: '10px'
  }
};

export default AdminOrders;
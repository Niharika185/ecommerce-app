import React, { useState, useEffect } from 'react';
import API from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet! <a href="/products">Start Shopping</a></p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.header}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <span style={{
                ...styles.status,
                backgroundColor:
                  order.status === 'delivered' ? 'green' :
                  order.status === 'cancelled' ? 'red' :
                  order.status === 'shipped' ? 'blue' : 'orange'
              }}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p>
            <div style={styles.products}>
              {order.products.map((item, index) => (
                <div key={index} style={styles.productItem}>
                  <span>{item.product?.name || 'Product'}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
            <p style={styles.total}><strong>Total: ₹{order.totalAmount}</strong></p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
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
    alignItems: 'center',
    marginBottom: '10px'
  },
  status: {
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px'
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
  total: {
    textAlign: 'right',
    marginTop: '10px',
    fontSize: '18px'
  }
};

export default Orders;
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (!address) return setMessage('Please enter shipping address');
    if (cart.length === 0) return setMessage('Cart is empty');

    setLoading(true);
    try {
      await API.post('/orders', {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        shippingAddress: address
      });
      clearCart();
      setMessage('✅ Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setMessage('❌ Order failed. Please try again.');
    }
    setLoading(false);
  };

  if (cart.length === 0) return (
    <div style={styles.container}>
      <h2>Your Cart</h2>
      <p>Cart is empty! <a href="/products">Continue Shopping</a></p>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2>Your Cart</h2>
      {message && <p style={styles.message}>{message}</p>}
      {cart.map(item => (
        <div key={item._id} style={styles.item}>
          <img src={item.image} alt={item.name} style={styles.image} />
          <div style={styles.details}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
          <div style={styles.quantity}>
            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
          </div>
          <p style={styles.subtotal}>₹{item.price * item.quantity}</p>
          <button style={styles.remove} onClick={() => removeFromCart(item._id)}>❌</button>
        </div>
      ))}

      <div style={styles.total}>
        <h3>Total: ₹{totalPrice}</h3>
      </div>

      <textarea
        style={styles.address}
        placeholder="Enter shipping address..."
        value={address}
        onChange={e => setAddress(e.target.value)}
        rows={3}
      />

      <button
        style={styles.button}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  details: { flex: 1 },
  quantity: { display: 'flex', alignItems: 'center', gap: '10px' },
  subtotal: { fontWeight: 'bold', minWidth: '80px' },
  remove: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
  total: { textAlign: 'right', padding: '10px 0' },
  address: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
    marginBottom: '10px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  message: { padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }
};

export default Cart;
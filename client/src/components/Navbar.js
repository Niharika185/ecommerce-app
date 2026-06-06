import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/products" style={styles.brand}>🛒 ShopEasy</Link>
      
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        
        {user && (
          <>
            <Link to="/cart" style={styles.link}>
              Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/admin/products" style={styles.link}>Manage Products</Link>
            <Link to="/admin/orders" style={styles.link}>Manage Orders</Link>
          </>
        )}

        {user ? (
          <button onClick={handleLogout} style={styles.button}>
            Logout ({user.name})
          </button>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white'
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  button: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  badge: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    marginLeft: '4px'
  }
};

export default Navbar;
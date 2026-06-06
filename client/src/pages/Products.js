import React, { useState, useEffect } from 'react';
import API from '../api';
import { useCart } from '../context/CartContext';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2>Products</h2>
      <input
        style={styles.search}
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map(product => (
            <div key={product._id} style={styles.card}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
              <h3>{product.name}</h3>
              <p style={styles.category}>{product.category}</p>
              <p style={styles.description}>{product.description}</p>
              <p style={styles.price}>₹{product.price}</p>
              <p style={styles.stock}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : '❌ Out of Stock'}
              </p>
              <button
                style={product.stock > 0 ? styles.button : styles.buttonDisabled}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  search: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  category: {
    color: '#888',
    fontSize: '14px'
  },
  description: {
    fontSize: '14px',
    color: '#555'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  },
  stock: {
    fontSize: '14px',
    color: 'green'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  buttonDisabled: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '16px'
  }
};

export default Products;
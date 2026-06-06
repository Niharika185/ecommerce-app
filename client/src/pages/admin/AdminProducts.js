import React, { useState, useEffect } from 'react';
import API from '../../api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    stock: '', category: '', image: ''
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/products/${editing}`, form);
        setMessage('✅ Product updated!');
      } else {
        await API.post('/products', form);
        setMessage('✅ Product added!');
      }
      setForm({ name: '', description: '', price: '', stock: '', category: '', image: '' });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      setMessage('❌ Error: ' + err.response?.data?.message);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        setMessage('✅ Product deleted!');
        fetchProducts();
      } catch (err) {
        setMessage('❌ Delete failed');
      }
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2>Manage Products</h2>
      {message && <p style={styles.message}>{message}</p>}

      {/* Add/Edit Form */}
      <div style={styles.form}>
        <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Product Name"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} placeholder="Description"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <input style={styles.input} placeholder="Price" type="number"
            value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input style={styles.input} placeholder="Stock" type="number"
            value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input style={styles.input} placeholder="Category"
            value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
          <input style={styles.input} placeholder="Image URL (optional)"
            value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
          <button style={styles.button} type="submit">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
          {editing && (
            <button style={styles.cancelButton} type="button"
              onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', stock: '', category: '', image: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Products List */}
      <div style={styles.grid}>
        {products.map(product => (
          <div key={product._id} style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <h3>{product.name}</h3>
            <p>₹{product.price} | Stock: {product.stock}</p>
            <p>{product.category}</p>
            <div style={styles.actions}>
              <button style={styles.editButton} onClick={() => handleEdit(product)}>Edit</button>
              <button style={styles.deleteButton} onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
  button: { padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
  cancelButton: { padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  image: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' },
  actions: { display: 'flex', gap: '10px', marginTop: '10px' },
  editButton: { flex: 1, padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteButton: { flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  message: { padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '10px' }
};

export default AdminProducts;
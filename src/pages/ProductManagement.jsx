import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllProducts, deleteProduct, addProduct } from '../firebase/products';
import './ProductManagement.css';

const FAKESTORE_URL = 'https://fakestoreapi.com/products';

function ProductManagement() {
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const handleSeed = async () => {
    // Duplicate guard — products already in Firestore, skip to avoid duplication.
    if (products.length > 0) {
      setSeedMsg('⚠ Products already exist in Firestore. Seeding skipped to avoid duplicates.');
      return;
    }

    if (!window.confirm(
      'This will import 20 sample products from FakeStore API into your Firestore database.\n\n' +
      'This is a one-time development action. After seeding, the app reads all products from Firestore only.\n\n' +
      'Continue?'
    )) return;

    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await fetch(FAKESTORE_URL);
      if (!res.ok) throw new Error('Failed to fetch sample products from FakeStore API.');
      const data = await res.json();
      await Promise.all(
        data.map((p) =>
          addProduct({
            title: p.title,
            price: p.price,
            category: p.category,
            description: p.description,
            image: p.image,
            rating: { rate: p.rating.rate, count: p.rating.count },
          })
        )
      );
      setSeedMsg(`✓ ${data.length} demo products imported into Firestore successfully. The app now reads all products from Firestore.`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err) {
      setSeedMsg('✗ ' + (err.message || 'Seeding failed. Check your internet connection.'));
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch {
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1 className="manage-title">Product Management</h1>
        <div className="manage-header-actions">
          <div className="seed-wrapper">
            <button className="seed-btn-sm" onClick={handleSeed} disabled={seeding}>
              {seeding ? 'Importing…' : '🌱 Seed Demo Products'}
            </button>
            <p className="seed-helper">
              One-time dev helper — imports sample data into Firestore only.
            </p>
          </div>
          <Link to="/products/add" className="add-product-btn">
            + Add Product
          </Link>
        </div>
      </div>

      {isLoading && <p className="manage-msg">Loading products…</p>}

      {error && (
        <p className="manage-error">
          Failed to load products: {error.message}
          {error.code === 'permission-denied' && (
            <> — Check Firestore rules: <code>products</code> must allow <code>read: if true</code>.</>
          )}
        </p>
      )}

      {seedMsg && (
        <p className={
          seedMsg.startsWith('✓') ? 'seed-success' :
          seedMsg.startsWith('⚠') ? 'seed-warning' :
          'seed-error'
        }>
          {seedMsg}
        </p>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="manage-empty">
          <span>📦</span>
          <p>No products yet.</p>
          <p className="manage-empty-hint">
            <Link to="/products/add">Add one manually</Link> or import demo products below.
          </p>
          <button className="seed-btn" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Importing…' : '🌱 Seed Demo Products to Firestore'}
          </button>
          <p className="seed-helper seed-helper--block">
            This is a one-time development helper. It imports 20 sample products from
            FakeStore API and saves them into your Firestore database. After seeding,
            all product reads, edits, deletes, and orders use Firestore only.
          </p>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="manage-table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image || 'https://via.placeholder.com/50'}
                      alt={p.title}
                      className="manage-img"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </td>
                  <td className="manage-title-cell" title={p.title}>
                    {p.title?.length > 50 ? p.title.slice(0, 50) + '…' : p.title}
                  </td>
                  <td>{p.category}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.rating?.rate ?? '—'}</td>
                  <td className="manage-actions">
                    <Link to={`/products/edit/${p.id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button
                      className="del-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;

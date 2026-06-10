import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../firebase/products';
import './ProductForm.css';

const INITIAL = {
  title: '',
  price: '',
  category: '',
  description: '',
  image: '',
  ratingRate: '',
  ratingCount: '',
};

function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim()) return setError('Title is required.');
    if (!form.price || isNaN(Number(form.price)))
      return setError('A valid price is required.');
    if (!form.category.trim()) return setError('Category is required.');

    setLoading(true);

    try {
      await addProduct({
        title: form.title.trim(),
        price: parseFloat(form.price),
        category: form.category.trim().toLowerCase(),
        description: form.description.trim(),
        image: form.image.trim(),
        rating: {
          rate: parseFloat(form.ratingRate) || 0,
          count: parseInt(form.ratingCount) || 0,
        },
      });

      setSuccess('Product added successfully! Redirecting…');
      setForm(INITIAL);
      setTimeout(() => navigate('/products/manage'), 1200);
    } catch (err) {
      setError(
        err.code === 'permission-denied'
          ? 'Permission denied. Make sure you are logged in and Firestore rules allow writes to "products".'
          : `Failed to add product: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="product-form-card">
        <h2>Add New Product</h2>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Product title"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (USD) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="electronics"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ratingRate">Rating (0–5)</label>
              <input
                id="ratingRate"
                name="ratingRate"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.ratingRate}
                onChange={handleChange}
                placeholder="4.5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ratingCount">Review Count</label>
              <input
                id="ratingCount"
                name="ratingCount"
                type="number"
                min="0"
                value={form.ratingCount}
                onChange={handleChange}
                placeholder="100"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/products/manage')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding product…' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;

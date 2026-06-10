import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct, updateProduct } from '../firebase/products';
import './ProductForm.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: '',
    ratingRate: '',
    ratingCount: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct(id)
      .then((p) => {
        setForm({
          title: p.title || '',
          price: p.price?.toString() || '',
          category: p.category || '',
          description: p.description || '',
          image: p.image || '',
          ratingRate: p.rating?.rate?.toString() || '',
          ratingCount: p.rating?.count?.toString() || '',
        });
      })
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.price || isNaN(Number(form.price)))
      return setError('A valid price is required.');
    if (!form.category.trim()) return setError('Category is required.');

    setSaving(true);
    try {
      await updateProduct(id, {
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
      navigate('/products/manage');
    } catch {
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="product-form-page">
        <p style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          Loading product…
        </p>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="product-form-card">
        <h2>Edit Product</h2>

        {error && <div className="form-error">{error}</div>}

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
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;

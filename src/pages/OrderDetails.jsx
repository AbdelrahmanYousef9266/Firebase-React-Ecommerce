import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../firebase/orders';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (ts) => {
    if (!ts?.toDate) return 'N/A';
    return ts.toDate().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <p className="details-loading">Loading order…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <p className="details-error">{error}</p>
        <Link to="/orders" className="back-orders-link">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <Link to="/orders" className="back-orders-link">
        ← Back to Orders
      </Link>

      <h1 className="details-title">Order Details</h1>

      <div className="details-meta">
        <div className="meta-row">
          <span className="meta-label">Order ID</span>
          <span className="meta-value">
            #{order.id.slice(-8).toUpperCase()}
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Date Placed</span>
          <span className="meta-value">{formatDate(order.createdAt)}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Email</span>
          <span className="meta-value">{order.userEmail}</span>
        </div>
      </div>

      <div className="details-items">
        <h3 className="items-heading">Items Ordered</h3>
        {order.items?.map((item) => (
          <div key={item.id} className="detail-item">
            <img
              src={item.image || 'https://via.placeholder.com/70'}
              alt={item.title}
              className="detail-item-img"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/70';
              }}
            />
            <div className="detail-item-info">
              <p className="detail-item-title">{item.title}</p>
              <p className="detail-item-category">{item.category}</p>
              <p className="detail-item-price">
                ${Number(item.price).toFixed(2)} × {item.quantity}
              </p>
            </div>
            <p className="detail-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="details-totals">
        <div className="totals-row">
          <span>Total Items</span>
          <span>{order.totalItems}</span>
        </div>
        <div className="totals-divider" />
        <div className="totals-row grand-total">
          <span>Total Price</span>
          <span className="grand-price">
            ${Number(order.totalPrice).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../firebase/orders';
import './Orders.css';

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchUserOrders(user.uid)
      .then((data) => {
        const sorted = data.sort(
          (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
        );
        setOrders(sorted);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (ts) => {
    if (!ts?.toDate) return 'N/A';
    return ts.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <p className="orders-loading">Loading orders…</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>

      {error && <p className="orders-error">{error}</p>}

      {!error && orders.length === 0 && (
        <div className="orders-empty">
          <span>📦</span>
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="orders-shop-btn">
            Start Shopping
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="order-card"
            >
              <div className="order-card-left">
                <p className="order-id">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-card-right">
                <span className="order-items-count">
                  {order.totalItems} item{order.totalItems !== 1 ? 's' : ''}
                </span>
                <span className="order-total-price">
                  ${Number(order.totalPrice).toFixed(2)}
                </span>
                <span className="order-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

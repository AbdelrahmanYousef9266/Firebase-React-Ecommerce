import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { selectCartCount } from '../features/cart/cartSlice.js';
import './Navbar.css';

function Navbar() {
  const cartCount = useSelector(selectCartCount);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-name">ShopReact</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/cart" className={`nav-link cart-link ${isActive('/cart')}`}>
              <span className="cart-icon">🛒</span>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/products/manage" className={`nav-link ${isActive('/products/manage')}`}>
                  Manage
                </Link>
              </li>
              <li>
                <button className="nav-link logout-nav-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className={`nav-link register-nav-link ${isActive('/register')}`}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

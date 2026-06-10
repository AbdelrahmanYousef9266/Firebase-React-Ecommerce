import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice.js';
import './CartItem.css';

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=No+Image';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  const handleDecrease = () => {
    if (item.quantity === 1) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrapper">
        <img
          src={imgError || !item.image ? PLACEHOLDER : item.image}
          alt={item.title}
          className="cart-item-image"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.title}</h4>
        <span className="cart-item-category">{item.category}</span>
        <span className="cart-item-unit-price">${Number(item.price).toFixed(2)} each</span>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button className="qty-btn" onClick={handleDecrease} aria-label="Decrease quantity">
            −
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button className="qty-btn" onClick={handleIncrease} aria-label="Increase quantity">
            +
          </button>
        </div>
        <span className="cart-item-subtotal">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          className="remove-btn"
          onClick={() => dispatch(removeFromCart(item.id))}
          aria-label="Remove item"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;

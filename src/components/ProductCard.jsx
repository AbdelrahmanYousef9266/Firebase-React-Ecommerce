import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../features/cart/cartSlice.js';
import './ProductCard.css';

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Image';

function StarRating({ rate = 0, count = 0 }) {
  const stars = Math.round(rate);
  return (
    <div className="rating">
      <span className="stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className={s <= stars ? 'star filled' : 'star'}>★</span>
        ))}
      </span>
      <span className="rating-text">{rate} ({count})</span>
    </div>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const cartItem = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={imgError || !product.image ? PLACEHOLDER : product.image}
          alt={product.title}
          className="product-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <StarRating
          rate={product.rating?.rate ?? 0}
          count={product.rating?.count ?? 0}
        />

        <div className="product-footer">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <button
            className={`add-to-cart-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added
              ? '✓ Added!'
              : cartItem
              ? `In Cart (${cartItem.quantity})`
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

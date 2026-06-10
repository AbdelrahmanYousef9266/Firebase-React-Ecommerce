import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/ProductCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { fetchAllProducts } from '../firebase/products';
import './Home.css';

function ProductGrid({ products, totalProducts, selectedCategory }) {
  if (totalProducts === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>No products found.</p>
        <p className="empty-hint">
          Add products from{' '}
          <Link to="/products/manage" className="empty-link">
            Manage Products
          </Link>
          .
        </p>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🔍</span>
        <p>No products in the &ldquo;{selectedCategory}&rdquo; category.</p>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function Home() {
  const renderTime = useRef(performance.now());
  console.time('HOME_RENDER');

  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      console.timeEnd('HOME_RENDER');
      console.log(`[Timing] Products ready in ${(performance.now() - renderTime.current).toFixed(0)}ms`);
    }
  }, [isLoading]);

  const categories = [...new Set(allProducts.map((p) => p.category))].filter(Boolean);

  const displayed = selectedCategory
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="hero-title">Discover Our Collection</h1>
        <p className="hero-subtitle">
          Explore top-quality products across all categories
        </p>
      </div>

      <div className="home-controls">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          categories={categories}
          isLoading={isLoading}
        />
        {!isLoading && (
          <span className="product-count">
            {displayed.length} product{displayed.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {isLoading && (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image" />
              <div className="skeleton-lines">
                <div className="skeleton-line long" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Failed to load products</h3>
          <p>{error.message}</p>
          <p className="error-hint">
            Open the browser console (F12) for details. Most common cause:
            Firestore security rules are blocking public reads on the{' '}
            <code>products</code> collection.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <ProductGrid
          products={displayed}
          totalProducts={allProducts.length}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
}

export default Home;

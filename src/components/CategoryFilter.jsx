import './CategoryFilter.css';

function CategoryFilter({ selected, onChange, categories = [], isLoading = false }) {
  return (
    <div className="category-filter">
      <label htmlFor="category-select" className="filter-label">
        Filter by Category
      </label>
      <div className="select-wrapper">
        <select
          id="category-select"
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="category-select"
          disabled={isLoading}
        >
          <option value="">All Products</option>
          {isLoading && <option disabled>Loading…</option>}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <span className="select-arrow">▾</span>
      </div>
    </div>
  );
}

export default CategoryFilter;

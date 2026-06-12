import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: 'prod-1',
  title: 'Wireless Headphones',
  price: 49.99,
  category: 'electronics',
  description: 'High quality wireless headphones with noise cancellation.',
  image: 'https://example.com/headphones.jpg',
  rating: { rate: 4.2, count: 85 },
};

describe('ProductCard', () => {
  it('renders the product title', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('renders the product price formatted to two decimal places', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('renders the product category badge', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('electronics')).toBeInTheDocument();
  });

  it('renders the Add to Cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('renders the product description', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(
      screen.getByText('High quality wireless headphones with noise cancellation.')
    ).toBeInTheDocument();
  });
});

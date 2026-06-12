import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestStore, renderWithProviders } from './utils';
import ProductCard from '../components/ProductCard';
import { selectCartCount, selectCartItems } from '../features/cart/cartSlice';

const mockProduct = {
  id: 'prod-1',
  title: 'Test Product',
  price: 29.99,
  category: 'electronics',
  description: 'A reliable test product.',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.0, count: 50 },
};

describe('Cart Integration', () => {
  it('cart is empty before any interaction', () => {
    const store = createTestStore();
    renderWithProviders(<ProductCard product={mockProduct} />, { store });
    expect(selectCartCount(store.getState())).toBe(0);
  });

  it('adds the product to the Redux store when Add to Cart is clicked', async () => {
    const store = createTestStore();
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />, { store });

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(selectCartCount(store.getState())).toBe(1);
    const items = selectCartItems(store.getState());
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('prod-1');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity when clicking the cart button on an item already in the cart', async () => {
    const store = createTestStore({
      cart: { items: [{ ...mockProduct, quantity: 1 }] },
    });
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />, { store });

    await user.click(screen.getByRole('button', { name: /in cart/i }));

    expect(selectCartCount(store.getState())).toBe(2);
  });

  it('stores the correct product data in the cart', async () => {
    const store = createTestStore();
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />, { store });

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    const [cartItem] = selectCartItems(store.getState());
    expect(cartItem.title).toBe('Test Product');
    expect(cartItem.price).toBe(29.99);
  });
});

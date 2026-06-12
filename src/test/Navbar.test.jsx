import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { createTestStore, renderWithProviders } from './utils';
import Navbar from '../components/Navbar';

vi.mock('../firebase/firebaseConfig', () => ({
  auth: {},
  db: {},
}));

vi.mock('firebase/auth', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, loading: false })),
}));

describe('Navbar', () => {
  it('renders Home and Cart navigation links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  it('shows Login and Register links when user is not authenticated', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('shows cart badge with correct item count', () => {
    const store = createTestStore({
      cart: { items: [{ id: '1', title: 'Test Item', price: 10, quantity: 3 }] },
    });
    renderWithProviders(<Navbar />, { store });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show cart badge when cart is empty', () => {
    renderWithProviders(<Navbar />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });
});

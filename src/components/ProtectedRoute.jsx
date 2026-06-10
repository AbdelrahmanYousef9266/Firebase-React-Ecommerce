import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Auth state not resolved yet — render nothing rather than redirecting.
  // This is fast (< 1s on warm connections) and only affects protected pages.
  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;

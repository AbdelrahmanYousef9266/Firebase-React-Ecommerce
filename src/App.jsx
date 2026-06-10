import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import AddProduct from './pages/AddProduct.jsx';
import EditProduct from './pages/EditProduct.jsx';
import ProductManagement from './pages/ProductManagement.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route
            path="/products/manage"
            element={<ProtectedRoute><ProductManagement /></ProtectedRoute>}
          />
          <Route
            path="/products/add"
            element={<ProtectedRoute><AddProduct /></ProtectedRoute>}
          />
          <Route
            path="/products/edit/:id"
            element={<ProtectedRoute><EditProduct /></ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute><Orders /></ProtectedRoute>}
          />
          <Route
            path="/orders/:id"
            element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

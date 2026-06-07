import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/Admin/Dashboard';
import UsersList from './pages/Admin/UsersList';
import StoresList from './pages/Admin/StoresList';
import CreateUser from './pages/Admin/CreateUser';
import CreateStore from './pages/Admin/CreateStore';
import UserDetail from './pages/Admin/UserDetail';
import UserStoresList from './pages/User/StoresList';
import OwnerDashboard from './pages/Owner/Dashboard';

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={
            <ProtectedRoute><ChangePassword /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="ADMIN"><UsersList /></ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute role="ADMIN"><UserDetail /></ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute role="ADMIN"><StoresList /></ProtectedRoute>
          } />
          <Route path="/admin/create-user" element={
            <ProtectedRoute role="ADMIN"><CreateUser /></ProtectedRoute>
          } />
          <Route path="/admin/create-store" element={
            <ProtectedRoute role="ADMIN"><CreateStore /></ProtectedRoute>
          } />
          <Route path="/stores" element={
            <ProtectedRoute role="NORMAL_USER"><UserStoresList /></ProtectedRoute>
          } />
          <Route path="/owner/dashboard" element={
            <ProtectedRoute role="STORE_OWNER"><OwnerDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

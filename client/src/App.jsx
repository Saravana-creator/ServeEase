import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';

// My styled pages
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ServiceList from './pages/ServicesPage';
import ServiceDetails from './pages/ServiceDetail';
import AddService from './pages/AddService';
import EditService from './pages/EditService';
import ManageServices from './pages/ManageServices';
import ProviderMessages from './pages/ProviderMessages';
import AdminDashboard from './pages/AdminDashboard';
import BillingPage from './pages/BillingPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';

// ProtectedRoute concept from incoming
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="signup" element={!user ? <Signup /> : <Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="services/add" element={user?.role === 'provider' ? <AddService /> : <Navigate to="/dashboard" replace />} />
        <Route path="services/edit/:id" element={user?.role === 'provider' ? <EditService /> : <Navigate to="/dashboard" replace />} />
        <Route path="billing/:id" element={user ? <BillingPage /> : <Navigate to="/login" replace />} />
        <Route path="manage-services" element={user?.role === 'provider' ? <ManageServices /> : <Navigate to="/dashboard" replace />} />
        <Route path="messages" element={user?.role === 'provider' ? <ProviderMessages /> : <Navigate to="/dashboard" replace />} />
        <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="feedback/:id" element={<FeedbackPage />} />
        <Route path="admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;

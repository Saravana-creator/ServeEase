import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ServiceList from './pages/ServiceList';
import ServiceDetails from './pages/ServiceDetails';
import AddService from './pages/AddService';
import EditService from './pages/EditService';
import ManageServices from './pages/ManageServices';
import ProviderMessages from './pages/ProviderMessages';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

function App() {
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
        <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="services/add" element={user?.role === 'provider' ? <AddService /> : <Navigate to="/dashboard" />} />
        <Route path="services/edit/:id" element={user?.role === 'provider' ? <EditService /> : <Navigate to="/dashboard" />} />
        <Route path="manage-services" element={user?.role === 'provider' ? <ManageServices /> : <Navigate to="/dashboard" />} />
        <Route path="messages" element={user?.role === 'provider' ? <ProviderMessages /> : <Navigate to="/dashboard" />} />
        <Route path="admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;

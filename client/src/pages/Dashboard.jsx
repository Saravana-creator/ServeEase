import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'customer') return <CustomerDashboard />;
  if (user.role === 'provider') return <ProviderDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <Navigate to="/" replace />;
};

export default Dashboard;

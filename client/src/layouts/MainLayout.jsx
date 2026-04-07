import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

const MainLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: { borderRadius: '12px', fontSize: '14px' },
        success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
      }}
    />
  </div>
);

export default MainLayout;

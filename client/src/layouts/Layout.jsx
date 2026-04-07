import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                <span className="bg-primary-600 text-white p-1 rounded-lg">SE</span>
                ServeEase
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
              <Link to="/services" className="text-slate-600 hover:text-primary-600 transition-colors">Services</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 transition-colors">Dashboard</Link>
                  <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User size={18} />
                      {user.name}
                    </span>
                    <button
                      onClick={logout}
                      className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Login</Link>
                  <Link
                    to="/signup"
                    className="bg-primary-600 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-500 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                <Link to="/" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Home</Link>
                <Link to="/services" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Services</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Dashboard</Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="pt-2 space-y-2">
                    <Link to="/login" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Login</Link>
                    <Link to="/signup" className="block px-3 py-2 bg-primary-600 text-white text-center rounded-lg">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

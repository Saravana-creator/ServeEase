import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-slate-900 text-white p-1 rounded-lg text-sm">SE</span>
                ServeEase
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
              <Link to="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Services</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link>
                  <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                         {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </span>
                    <button
                      onClick={logout}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
                  <Link
                    to="/signup"
                    className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow"
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
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                <Link to="/" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Home</Link>
                <Link to="/services" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Services</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Dashboard</Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="pt-2 space-y-2">
                    <Link to="/login" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Login</Link>
                    <Link to="/signup" className="block px-3 py-2 bg-slate-900 text-white font-medium text-center rounded-lg text-sm">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;

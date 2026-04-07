import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);
  const handleLogout = () => { logout(); navigate('/login'); close(); };

  const roleColor = {
    customer: 'bg-blue-100 text-blue-700',
    provider: 'bg-green-100 text-green-700',
    admin: 'bg-red-100 text-red-700',
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="font-bold text-xl text-indigo-600">ServeEase</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/services">Services</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
            {user?.role === 'admin' && <NavLink to="/dashboard">Admin Panel</NavLink>}
            {user && <NavLink to="/profile">Profile</NavLink>}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColor[user.role]}`}>
                  {user.role}
                </span>
                <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">{user.name}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/signup" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">Sign Up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <motion.div animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-gray-600 mb-1.5 origin-center transition-all" />
            <motion.div animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-5 h-0.5 bg-gray-600 mb-1.5" />
            <motion.div animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-gray-600 origin-center transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1 overflow-hidden"
          >
            <NavLink to="/services" onClick={close}>Services</NavLink>
            {user && <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>}
            {user && <NavLink to="/profile" onClick={close}>Profile</NavLink>}

            <div className="border-t border-gray-100 mt-2 pt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${roleColor[user.role]}`}>
                      {user.role}
                    </span>
                    <span className="text-sm text-gray-700 font-medium truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <NavLink to="/login" onClick={close}>Login</NavLink>
                  <NavLink to="/signup" onClick={close}>Sign Up</NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

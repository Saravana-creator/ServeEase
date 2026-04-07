import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const features = [
  { icon: '🔧', title: 'Skilled Providers', desc: 'Verified electricians, plumbers, cleaners and more' },
  { icon: '📍', title: 'Local Services', desc: 'Find professionals in your area instantly' },
  { icon: '💬', title: 'Direct Contact', desc: 'Message providers directly through the platform' },
  { icon: '⭐', title: 'Trusted Platform', desc: 'Admin-moderated listings for quality assurance' },
];

const HomePage = () => {
  const { user } = useAuth();
  return (
    <PageTransition>
      <div className="space-y-20">
        {/* Hero */}
        <div className="text-center py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full mb-6">
              🚀 Local Services, Simplified
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
              Find Trusted Local<br />
              <span className="text-indigo-600">Service Providers</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Connect with skilled electricians, plumbers, cleaners and more — all in one place.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/services">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                  Browse Services
                </motion.button>
              </Link>
              {!user && (
                <Link to="/signup">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-7 py-3.5 bg-white text-indigo-600 border-2 border-indigo-200 rounded-xl font-semibold hover:border-indigo-400 transition-colors">
                    Get Started Free
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why ServeEase?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;

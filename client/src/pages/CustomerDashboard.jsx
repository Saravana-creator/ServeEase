import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages')
      .then(({ data }) => setMessages(data))
      .finally(() => setLoading(false));
  }, []);

  const uniqueServices = [...new Map(messages.map(m => [m.service?._id, m.service])).values()].filter(Boolean);

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Here's your activity overview</p>
          </div>
          <Link to="/services"
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors font-medium">
            Browse Services
          </Link>
        </div>

        {/* Stats */}
        <motion.div variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div variants={itemVariants}>
            <StatCard icon="💬" label="Inquiries Sent" value={loading ? '—' : messages.length} color="indigo" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="🔧" label="Services Contacted" value={loading ? '—' : uniqueServices.length} color="blue" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="📅" label="Member Since" value={new Date(user.createdAt || Date.now()).getFullYear()} color="green" />
          </motion.div>
        </motion.div>

        {/* Contacted Services */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Services You've Contacted</h2>
          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner text="Loading activity..." /></div>
          ) : uniqueServices.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 font-medium">No inquiries yet</p>
              <p className="text-sm text-gray-400 mt-1">Browse services and send your first inquiry</p>
              <Link to="/services" className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                Explore Services
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueServices.map((svc) => (
                <motion.div key={svc._id} variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-1 truncate">{svc.title}</p>
                  <p className="text-xs text-indigo-600 font-medium mb-3">{svc.category}</p>
                  <Link to={`/services/${svc._id}`}
                    className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                    View service →
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Recent Messages */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Inquiries</h2>
          {loading ? null : messages.length === 0 ? null : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
              {messages.slice(0, 5).map((msg) => (
                <motion.div key={msg._id} variants={itemVariants}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    {msg.receiver?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">To: {msg.receiver?.name}</p>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">Re: {msg.service?.title}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default CustomerDashboard;

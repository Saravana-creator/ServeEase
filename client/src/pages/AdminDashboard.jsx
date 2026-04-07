import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { SkeletonStatCard } from '../components/SkeletonCard';
import AdminPanel from '../components/AdminPanel';
import PageTransition from '../components/PageTransition';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, services: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/services'),
      api.get('/messages'),
    ]).then(([u, s, m]) => {
      setStats({ users: u.data.length, services: s.data.length, messages: m.data.length });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview and management tools</p>
        </div>

        {/* Stats */}
        <motion.div variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}><SkeletonStatCard /></motion.div>
            ))
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <StatCard icon="👥" label="Total Users" value={stats.users} color="indigo" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard icon="🔧" label="Total Services" value={stats.services} color="green" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard icon="💬" label="Total Messages" value={stats.messages} color="blue" />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Platform Health Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Platform Health</h3>
              <p className="text-indigo-200 text-sm">All systems operational</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'Users', val: stats.users },
                { label: 'Services', val: stats.services },
                { label: 'Messages', val: stats.messages },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/10 rounded-xl px-4 py-2 text-center min-w-[64px]">
                  <p className="text-xl font-bold">{loading ? '—' : val}</p>
                  <p className="text-xs text-indigo-200 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Admin Panel Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Management Panel</h2>
          <AdminPanel />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;

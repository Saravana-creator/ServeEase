import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const ROLE_META = {
  customer: { label: 'Customer', color: 'bg-blue-100 text-blue-700', icon: '👤' },
  provider: { label: 'Service Provider', color: 'bg-green-100 text-green-700', icon: '🔧' },
  admin: { label: 'Administrator', color: 'bg-red-100 text-red-700', icon: '🛡️' },
};

const validate = ({ name, email }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
  return errors;
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const meta = ROLE_META[user.role];

  const [form, setForm] = useState({ name: user.name || '', email: user.email || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', { name: form.name.trim(), email: form.email.trim() });
      updateUser(data);
      toast.success('Profile updated!');
      setSaved(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account details</p>
        </div>

        {/* Avatar + Role Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-bold text-3xl shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{user.email}</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${meta.color}`}>
              <span>{meta.icon}</span>
              {meta.label}
            </span>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-5">Edit Information</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="pt-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <div className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 flex items-center gap-2`}>
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                <span className="text-xs text-gray-400 ml-auto">Assigned by system</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } disabled:opacity-60`}
            >
              {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </motion.button>
          </form>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Account Info</h3>
          <div className="space-y-3">
            {[
              { label: 'Account ID', value: user.id || user._id },
              { label: 'Role', value: meta.label },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;

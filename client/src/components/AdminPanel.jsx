import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { SkeletonTableRow } from './SkeletonCard';

const TABS = ['Users', 'Services', 'Categories'];

const tabIcons = { Users: '👥', Services: '🔧', Categories: '🏷️' };

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-100 text-indigo-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${colors[color]}`}>
      {children}
    </span>
  );
};

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full"
    >
      <div className="text-3xl mb-3 text-center">⚠️</div>
      <p className="text-gray-800 font-medium text-center mb-5">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
          Confirm
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Users Tab ─────────────────────────────────────────────────────────────── */
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User removed');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setConfirm(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{users.length} total users</p>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full sm:w-64 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>User</span><span>Email</span><span>Role</span><span>Action</span>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 sm:gap-4 items-start sm:items-center px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900 text-sm truncate">{u.name}</span>
                </div>
                <span className="text-sm text-gray-500 truncate pl-12 sm:pl-0">{u.email}</span>

                {/* Role selector */}
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                >
                  {['customer', 'provider', 'admin'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirm({ id: u._id, name: u.name })}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            message={`Remove "${confirm.name}" from the platform?`}
            onConfirm={() => handleDelete(confirm.id)}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Services Tab ──────────────────────────────────────────────────────────── */
const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => setServices(data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success('Service removed');
    } catch {
      toast.error('Failed to remove service');
    } finally {
      setConfirm(null);
    }
  };

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase()) ||
    s.provider?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{services.length} total services</p>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, category, provider…"
          className="w-full sm:w-72 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>Service</span><span>Category</span><span>Price</span><span>Provider</span><span>Action</span>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-3xl mb-2">🔧</p>
            <p className="text-sm">No services found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 items-start sm:items-center px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {s.location}</p>
                </div>
                <Badge color="indigo">{s.category}</Badge>
                <span className="text-sm font-semibold text-indigo-600">₹{s.price}</span>
                <span className="text-sm text-gray-500">{s.provider?.name}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirm({ id: s._id, title: s.title })}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            message={`Remove service "${confirm.title}"?`}
            onConfirm={() => handleDelete(confirm.id)}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Categories Tab ────────────────────────────────────────────────────────── */
const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post('/categories', { name: newName.trim() });
      setCategories(prev => [...prev, data]);
      setNewName('');
      toast.success('Category added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await api.put(`/categories/${id}/approve`);
      setCategories(prev => prev.map(c => c._id === id ? data : c));
      toast.success('Category approved');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setConfirm(null);
    }
  };

  const pending = categories.filter(c => !c.approved);
  const approved = categories.filter(c => c.approved);

  return (
    <div className="space-y-6">
      {/* Add new */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          value={newName} onChange={e => setNewName(e.target.value)}
          placeholder="New category name…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <motion.button
          whileTap={{ scale: 0.97 }} type="submit" disabled={adding || !newName.trim()}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {adding ? 'Adding…' : '+ Add'}
        </motion.button>
      </form>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} />)}</div>
      ) : (
        <>
          {/* Pending Approval */}
          {pending.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Pending Approval ({pending.length})
              </h3>
              <div className="bg-white rounded-2xl border border-yellow-100 shadow-sm overflow-hidden">
                <AnimatePresence>
                  {pending.map((cat, i) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏷️</span>
                        <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                        <Badge color="yellow">pending</Badge>
                      </div>
                      <div className="flex gap-2">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleApprove(cat._id)}
                          className="text-xs px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors">
                          Approve
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setConfirm({ id: cat._id, name: cat.name })}
                          className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Approved */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Approved Categories ({approved.length})
            </h3>
            {approved.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-10 text-center text-gray-400 text-sm">
                No approved categories yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence>
                  {approved.map((cat, i) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🏷️</span>
                        <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirm({ id: cat._id, name: cat.name })}
                        className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            message={`Delete category "${confirm.name}"?`}
            onConfirm={() => handleDelete(confirm.id)}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main AdminPanel ───────────────────────────────────────────────────────── */
const AdminPanel = () => {
  const [tab, setTab] = useState('Users');

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tabIcons[t]}</span>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'Users' && <UsersTab />}
          {tab === 'Services' && <ServicesTab />}
          {tab === 'Categories' && <CategoriesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;

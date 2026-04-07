import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import ConfirmDialog from '../components/ConfirmDialog';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const TABS = ['Services', 'Messages'];

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Services');
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingSvc, setLoadingSvc] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/messages/${id}/status`, { status });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      toast.success(`Job ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleReply = async (id, replyContent) => {
    try {
      await api.put(`/messages/${id}/reply`, { replyContent });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, replyContent } : m));
      toast.success('Reply sent');
    } catch {
      toast.error('Failed to send reply');
    }
  };

  useEffect(() => {
    api.get('/services/mine')
      .then(({ data }) => setServices(data.data || []))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoadingSvc(false));

    api.get('/messages')
      .then(({ data }) => setMessages(data.data || []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoadingMsg(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/services/${deleteId}`);
      setServices(prev => prev.filter(s => s._id !== deleteId));
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your services and inquiries</p>
          </div>
          <Link to="/services/add"
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors font-medium">
            + Add Service
          </Link>
        </div>

        {/* Stats */}
        <motion.div variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div variants={itemVariants}>
            <StatCard icon="🔧" label="Active Services" value={loadingSvc ? '—' : services.length} color="indigo" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="💬" label="Inquiries Received" value={loadingMsg ? '—' : messages.length} color="green" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="🆕" label="New This Week" value={loadingMsg ? '—' : (messages || []).filter(m => {
              const d = new Date(m.createdAt);
              const now = new Date();
              return (now - d) / (1000 * 60 * 60 * 24) <= 7;
            }).length} color="blue" />
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t}
              {t === 'Messages' && messages.length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {messages.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'Services' && (
            <motion.div key="services" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              {loadingSvc ? (
                <div className="flex justify-center py-12"><LoadingSpinner text="Loading services..." /></div>
              ) : services.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">🔧</p>
                  <p className="text-gray-500 font-medium">No services yet</p>
                  <Link to="/services/add" className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Add Your First Service
                  </Link>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {services.map((svc) => (
                    <motion.div key={svc._id} variants={itemVariants}
                      whileHover={{ x: 4 }}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <Link to={`/services/${svc._id}`} className="font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors">
                            {svc.title}
                          </Link>
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full shrink-0">{svc.category?.name || 'Uncategorized'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📍 {svc.location}</span>
                          <span className="font-semibold text-indigo-600">₹{svc.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/services/edit/${svc._id}`)}
                          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors font-medium">
                          Edit
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteId(svc._id)}
                          className="px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium disabled:opacity-50">
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === 'Messages' && (
            <motion.div key="messages" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              {loadingMsg ? (
                <div className="flex justify-center py-12"><LoadingSpinner text="Loading messages..." /></div>
              ) : messages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-gray-500 font-medium">No inquiries yet</p>
                  <p className="text-sm text-gray-400 mt-1">Customer messages will appear here</p>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {messages.map((msg) => (
                    <motion.div key={msg._id} variants={itemVariants}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {msg.sender?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{msg.sender?.name}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              msg.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              msg.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {msg.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {msg.sender?.email} · Re: <span className="text-indigo-600 font-medium">{msg.service?.title}</span>
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">{msg.content}</p>
                        </div>
                      </div>

                      {msg.replyContent && (
                        <div className="ml-14 bg-indigo-50 p-4 rounded-2xl border border-indigo-100 relative">
                          <div className="absolute -top-2 left-4 w-4 h-4 bg-indigo-50 rotate-45 border-l border-t border-indigo-100" />
                          <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Your Reply</p>
                          <p className="text-sm text-indigo-900 italic">{msg.replyContent}</p>
                        </div>
                      )}

                      <div className="ml-14 flex flex-col sm:flex-row gap-3 pt-2">
                        {msg.status === 'pending' ? (
                          <>
                            <button onClick={() => handleUpdateStatus(msg._id, 'accepted')} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition shadow-md">
                              Accept Job
                            </button>
                            <button onClick={() => handleUpdateStatus(msg._id, 'rejected')} className="flex-1 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition">
                              Decline
                            </button>
                          </>
                        ) : !msg.replyContent && (
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Type a message (e.g. I'll be there tomorrow at 10am)..."
                              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  handleReply(msg._id, e.target.value.trim());
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Reply</button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmDialog 
          isOpen={!!deleteId}
          title="Remove Service?"
          message="This will completely remove your service from ServeEase. Are you sure?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmText={isDeleting ? "Removing..." : "Remove"}
        />
      </div>
    </PageTransition>
  );
};

export default ProviderDashboard;

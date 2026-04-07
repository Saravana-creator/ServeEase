import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ServiceCard from '../components/ServiceCard';
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

const TABS = ['Services', 'Messages', 'Jobs', 'Feedbacks'];

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Services');
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingSvc, setLoadingSvc] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingFb, setLoadingFb] = useState(true);
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

  const [replyDrafts, setReplyDrafts] = useState({});

  const handleReply = async (id) => {
    const replyContent = replyDrafts[id];
    if (!replyContent?.trim()) return;
    try {
      await api.put(`/messages/${id}/reply`, { replyContent: replyContent.trim() });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, replyContent: replyContent.trim() } : m));
      setReplyDrafts(prev => ({ ...prev, [id]: '' }));
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

    api.get('/bookings/provider')
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoadingBook(false));

    api.get('/feedbacks/provider')
      .then(({ data }) => setFeedbacks(data.data || []))
      .catch(() => toast.error('Failed to load feedbacks'))
      .finally(() => setLoadingFb(false));
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
          className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <StatCard icon="🔧" label="Services" value={loadingSvc ? '—' : services.length} color="indigo" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="💬" label="Inquiries" value={loadingMsg ? '—' : messages.length} color="green" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="⭐" label="Avg Rating" value={feedbacks.length ? (feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1) : '—'} color="amber" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon="🆕" label="New Jobs" value={loadingMsg ? '—' : messages.filter(m => m.status === 'pending').length} color="blue" />
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
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((svc, i) => (
                    <div key={svc._id} className="relative group">
                      <ServiceCard service={svc} index={i} isStatic={true} />
                      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/services/edit/${svc._id}`)}
                          className="p-2 bg-white/90 backdrop-blur shadow-sm text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                          ✏️
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteId(svc._id)}
                          className="p-2 bg-white/90 backdrop-blur shadow-sm text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                          🗑️
                        </motion.button>
                      </div>
                    </div>
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
                              msg.status === 'accepted' ? 'bg-indigo-100 text-indigo-700' :
                              msg.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {msg.status === 'accepted' ? 'Awaiting Payment' : msg.status}
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
                              value={replyDrafts[msg._id] || ''}
                              onChange={(e) => setReplyDrafts({...replyDrafts, [msg._id]: e.target.value})}
                              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleReply(msg._id);
                              }}
                            />
                            <button onClick={() => handleReply(msg._id)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all">Reply</button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === 'Jobs' && (
            <motion.div key="jobs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
               {loadingBook ? (
                 <div className="flex justify-center py-12"><LoadingSpinner text="Loading initiated jobs..." /></div>
               ) : bookings.length === 0 ? (
                 <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center shadow-inner">
                   <p className="text-5xl mb-6">🗓️</p>
                   <h3 className="text-xl font-bold text-gray-900">No scheduled work yet</h3>
                   <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Once a customer pays for an accepted inquiry, the job will appear here as "Initiated".</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {bookings.map((book) => (
                      <motion.div 
                        key={book._id} 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-8 border-l-8 border-l-green-500"
                      >
                         <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                               <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-200">Initiated ✓</span>
                               <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">ORDER #{book._id.slice(-6).toUpperCase()}</span>
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-xl tracking-tight mb-2">{book.service?.title}</h3>
                            
                            <div className="flex items-start gap-4 mt-6 p-4 bg-gray-50 rounded-2xl">
                               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">👤</div>
                               <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customer Details</p>
                                  <p className="font-bold text-gray-900">{book.customer?.name}</p>
                                  <p className="text-sm text-gray-500">{book.customer?.email}</p>
                                </div>
                            </div>
                         </div>
                         
                         <div className="md:w-64 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-8">
                            <div className="w-full text-right">
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Payment Received</p>
                               <p className="text-3xl font-extrabold text-indigo-600">₹{book.amount}</p>
                               <span className="text-[10px] text-gray-400 font-medium">via {book.paymentMethod}</span>
                            </div>
                            
                            <div className="w-full mt-8">
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Requested On</p>
                               <p className="text-sm font-bold text-gray-700">{new Date(book.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
               )}
            </motion.div>
          )}

          {tab === 'Feedbacks' && (
            <motion.div key="feedbacks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loadingFb ? (
                <div className="flex justify-center py-12"><LoadingSpinner text="Loading feedbacks..." /></div>
              ) : feedbacks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">⭐</p>
                  <p className="text-gray-500 font-medium">No feedbacks yet</p>
                  <p className="text-sm text-gray-400 mt-1">Provider high quality service to earn reviews!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbacks.map((fb, i) => (
                    <motion.div key={fb._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                             {fb.customer?.name?.charAt(0)}
                           </div>
                           <p className="text-sm font-bold text-gray-900">{fb.customer?.name}</p>
                         </div>
                         <div className="flex text-amber-400 text-xs">
                            {Array.from({ length: fb.rating }).map((_, j) => <span key={j}>★</span>)}
                         </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{fb.text}"</p>
                      <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">{new Date(fb.createdAt).toLocaleDateString()}</p>
                    </motion.div>
                  ))}
                </div>
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

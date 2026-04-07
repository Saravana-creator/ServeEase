import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import { SkeletonStatCard } from '../components/SkeletonCard';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get(`/services/${id}`),
      api.get(`/feedbacks/service/${id}`)
    ]).then(([s, f]) => {
      setService(s.data.data);
      setFeedbacks(f.data.data || []);
    }).catch(() => {
      toast.error('Service details not found');
      navigate('/services');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', {
        receiverId: service.provider._id,
        serviceId: service._id,
        content: message.trim()
      });
      toast.success('Inquiry sent successfully!');
      setMessage('');
    } catch {
      toast.error('Failed to send inquiry');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto space-y-6">
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </PageTransition>
    );
  }

  if (!service) return null;

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 -z-10" />
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-square bg-indigo-100 rounded-2xl flex items-center justify-center text-5xl">
              🔧
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">{service.category?.name || 'Uncategorized'}</span>
                <span className="text-gray-400 text-sm flex items-center gap-1">📍 {service.location}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900">{service.title}</h1>
              <p className="text-gray-500 text-lg leading-relaxed">{service.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-6">
                <div>
                  <p className="text-3xl font-bold text-indigo-600">₹{service.price}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase mt-1">Starting Price</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {service.provider?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">{service.provider?.name}</p>
                        <p className="text-xs text-gray-400">Verified Provider</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">💬</span>
                    Send an Inquiry
                </h3>
                {user ? (
                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <textarea 
                            value={message} onChange={e => setMessage(e.target.value)} required
                            rows={4} placeholder={`Ask ${service.provider?.name} about their expertise or availability...`}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none bg-gray-50"
                        />
                        <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={sending || !message.trim()}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100">
                            {sending ? 'Sending...' : 'Send Message'}
                        </motion.button>
                        <p className="text-center text-xs text-gray-400">Your contact info will be shared with the provider</p>
                    </form>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">Please log in to contact this professional</p>
                        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                            Login Now
                        </button>
                    </div>
                )}
            </section>

            {/* Reviews Preview */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Customer Feedbacks ({feedbacks.length})
                    </h3>
                    <Link to={`/feedback/${id}`} className="text-sm font-bold text-indigo-600 hover:underline">
                        Write a Review →
                    </Link>
                </div>
                
                {feedbacks.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                        <p className="text-gray-400 text-sm italic">No reviews yet for this service</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedbacks.slice(0, 3).map((f, i) => (
                            <motion.div key={f._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-bold text-gray-400 shrink-0">
                                    {f.customer?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-gray-800">{f.customer?.name}</p>
                                        <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{new Date(f.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pt-1 line-clamp-2 italic">"{f.text}"</p>
                                </div>
                            </motion.div>
                        ))}
                        {feedbacks.length > 3 && (
                            <Link to={`/feedback/${id}`} className="block text-center py-3 bg-gray-50 rounded-2xl text-sm font-bold text-slate-600 hover:bg-gray-100 transition-colors">
                                View all {feedbacks.length} reviews
                            </Link>
                        )}
                    </div>
                )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
                <h4 className="text-lg font-bold mb-4">Fast Booking</h4>
                <p className="text-indigo-100 text-sm mb-6">Choose a slot and proceed to secure checkout. Handled by ServeEase Payment Gateway.</p>
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(`/billing/${id}`)}
                    className="w-full py-3.5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-md">
                    Proceed to Billing →
                </motion.button>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 px-2">Safety Features</h4>
                <div className="space-y-4">
                    {[
                        { icon: '🛡️', title: 'Background Checked', text: 'Verified identity and skills' },
                        { icon: '📍', title: 'Service Warranty', text: '7-day service guarantee' },
                        { icon: '📞', title: '24/7 Support', text: 'Dedicated help center' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-2">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServiceDetail;

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import { MessageSquare, Star, ArrowLeft, Loader2, Send } from 'lucide-react';

const FeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [s, f] = await Promise.all([
        api.get(`/services/${id}`),
        api.get(`/feedbacks/service/${id}`)
      ]);
      setService(s.data.data);
      setFeedbacks(f.data.data || []);
    } catch {
      toast.error('Failed to load feedback details');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return toast.error('Please enter your feedback');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/feedbacks/${id}`, { text, rating });
      toast.success('Thank you for your feedback!');
      setFeedbacks(prev => [data.data, ...prev]);
      setText('');
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  if (!service) return null;

  const canReview = user && user.role === 'customer' && service.provider._id !== user.id;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to={`/services/${id}`} className="inline-flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-slate-800 transition-colors">
          <ArrowLeft size={18} /> Back to Service
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Feedbacks & Reviews</h1>
          <p className="text-slate-500">Service: <span className="text-indigo-600 font-bold">{service.title}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Form */}
          <div className="md:col-span-1">
            {canReview ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Share your experience</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Rating</label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star} type="button" onClick={() => setRating(star)}
                          className={`text-2xl transition-transform active:scale-90 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Your Review</label>
                    <textarea
                      rows={4} value={text} onChange={e => setText(e.target.value)}
                      placeholder="How was the service? Mention quality, punctuality..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
                    />
                  </div>
                  <button
                    disabled={submitting}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Submit Review</>}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-200 text-center sticky top-24">
                <p className="text-slate-400 text-sm font-medium">Log in as a customer to share your feedback for this service.</p>
              </div>
            )}
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare className="text-indigo-600" size={24} /> 
              Recent Reviews ({feedbacks.length})
            </h3>

            {feedbacks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <p className="text-slate-400 font-medium">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <AnimatePresence>
                {feedbacks.map((f, i) => (
                  <motion.div
                    key={f._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {f.customer?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{f.customer?.name}</p>
                          <div className="flex text-amber-400 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>{i < f.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{f.text}"</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FeedbackPage;

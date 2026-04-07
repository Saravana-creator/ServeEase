import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const ServiceDetailSkeleton = () => (
  <div className="max-w-5xl mx-auto animate-pulse">
    <div className="h-4 w-16 bg-gray-200 rounded mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-2/3 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-28 w-full bg-gray-200 rounded-xl" />
        <div className="h-11 w-full bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

const ContactForm = ({ service }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!content.trim()) return 'Message cannot be empty';
    if (content.trim().length < 10) return 'Message must be at least 10 characters';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/messages', { serviceId: service._id, content: content.trim() });
      toast.success('Message sent to provider!');
      setSent(true);
      setContent('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="bg-indigo-50 rounded-2xl p-6 text-center">
      <p className="text-gray-600 mb-3">Sign in to contact this provider</p>
      <Link to="/login" className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
        Login to Contact
      </Link>
    </div>
  );

  if (user.role === 'provider' || user.role === 'admin') return null;

  if (sent) return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <div className="text-4xl mb-2">✅</div>
      <p className="font-semibold text-green-800">Message sent!</p>
      <p className="text-sm text-green-600 mt-1">The provider will get back to you soon.</p>
      <button onClick={() => setSent(false)} className="mt-4 text-sm text-indigo-600 hover:underline">Send another</button>
    </motion.div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => { setContent(e.target.value); setError(''); }}
          placeholder="Describe what you need help with..."
          className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors text-sm"
      >
        {loading ? 'Sending...' : 'Send Inquiry'}
      </motion.button>
    </form>
  );
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/services/${id}`)
      .then(({ data }) => setService(data))
      .catch(() => { toast.error('Service not found'); navigate('/services'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <PageTransition><ServiceDetailSkeleton /></PageTransition>;
  if (!service) return null;

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                    {service.category}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-indigo-600">₹{service.price}</p>
                  <p className="text-xs text-gray-400">per service</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>📍</span>
                <span>{service.location}</span>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{service.description}</p>
              </div>
            </motion.div>

            {/* Provider Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">About the Provider</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {service.provider.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{service.provider.name}</p>
                  <p className="text-sm text-gray-500">{service.provider.email}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="space-y-4">
            {/* Book & Pay CTA — only for customers */}
            {user?.role === 'customer' && (
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                <p className="text-indigo-200 text-xs font-medium mb-1">Ready to book?</p>
                <p className="text-2xl font-bold mb-1">₹{service.price}</p>
                <p className="text-indigo-200 text-xs mb-4">+ 18% GST & fees apply</p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/billing/${service._id}`)}
                  className="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                >
                  🛒 Book & Pay
                </motion.button>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Contact Provider</h2>
              <ContactForm service={service} />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServiceDetail;

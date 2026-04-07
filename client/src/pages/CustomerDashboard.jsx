import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get('/messages'),
      api.get('/bookings/my-bookings'),
      api.get('/feedbacks/my-reviews')
    ]).then(([m, b, r]) => {
      setMessages(m.data.data || []);
      setBookings(b.data.data || []);
      setReviews(r.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/complete`);
      toast.success('Service marked as completed!');
      fetchData();
    } catch {
      toast.error('Failed to complete service');
    }
  };

  // Services used = Services booked OR contacted
  const distinctServices = [];
  const map = new Map();
  
  // Add booked services first (priority)
  for (const b of bookings) {
    if (b.service && !map.has(b.service._id)) {
      map.set(b.service._id, { ...b.service, type: 'booked', bookingStatus: b.status, bookingId: b._id });
      distinctServices.push(map.get(b.service._id));
    }
  }
  
  // Add contacted services if not already booked
  for (const m of messages) {
    if (m.service && !map.has(m.service._id)) {
      map.set(m.service._id, { ...m.service, type: 'contacted', messageStatus: m.status });
      distinctServices.push(map.get(m.service._id));
    }
  }

  // Pending reviews: Only for COMPLETED services or contacted services
  const reviewedServiceIds = new Set(reviews.map(r => r.service?._id));
  const pendingReviewServices = distinctServices.filter(s => {
    if (reviewedServiceIds.has(s._id)) return false;
    // Show if service was booked and is NOW COMPLETED, or if it was just an enquiry (legacy/flexible)
    return s.bookingStatus === 'completed' || s.type === 'contacted';
  });

  return (
    <PageTransition>
      <div className="space-y-12 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Dashboard</h1>
            <p className="text-gray-500 mt-1">Hello, {user.name}! Track your inquiries and manage your service experience.</p>
          </div>
          <Link to="/services" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2">
             🔍 Browse New Services
          </Link>
        </div>

        {/* Stats */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard icon="💬" label="Total Inquiries" value={loading ? '—' : messages.length} color="indigo" />
          <StatCard icon="🔧" label="Services Used" value={loading ? '—' : distinctServices.length} color="blue" />
          <StatCard icon="⭐" label="Your Reviews" value={loading ? '—' : reviews.length} color="amber" />
          <StatCard icon="📝" label="Pending Feedback" value={loading ? '—' : pendingReviewServices.length} color="rose" />
        </motion.div>

        {/* RECENT INQUIRIES SECTION */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-600 rounded-full" />
              Active Inquiries & Recent Activity
            </h2>
            <p className="text-xs text-gray-400 font-medium">1 Inquiry per Service</p>
          </div>
          
          {loading ? (
             <div className="flex justify-center py-10"><LoadingSpinner /></div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
              <p className="text-4xl mb-4">📮</p>
              <h3 className="text-lg font-bold text-gray-900">No active enquiries</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Start by sending messages to service providers and they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
               {messages.map((msg, i) => {
                 // Check if this inquiry already led to a booking
                 const hasBooking = bookings.some(b => b.service?._id === msg.service?._id);
                 // We still show the inquiry but mark it as completed/booked if needed
                 // Or just keep showing active ones if they are not booked yet.
                 // User says "already present service is not presetn" - they might want to see both.

                 return (
                   <motion.div key={msg._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                 {msg.receiver?.name?.charAt(0)}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-gray-900">{msg.receiver?.name}</p>
                                 <Link to={`/services/${msg.service?._id}`} className="text-xs text-indigo-600 font-bold hover:underline">
                                   Service: {msg.service?.title}
                                 </Link>
                               </div>
                             </div>
                             <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                               hasBooking ? 'bg-green-100 text-green-700' :
                               msg.status === 'accepted' ? 'bg-indigo-100 text-indigo-700' : 
                               msg.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                             }`}>
                               {hasBooking ? 'Initiated & Paid' : msg.status === 'accepted' ? 'Pending Payment' : msg.status}
                             </span>
                          </div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl italic">"{msg.content}"</p>
                        </div>

                        {msg.replyContent && (
                          <div className="flex-1 bg-slate-900 p-5 rounded-2xl text-white relative">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Reply from Provider</p>
                            </div>
                            <p className="text-sm leading-relaxed">{msg.replyContent}</p>
                          </div>
                        )}
                      </div>
                   </motion.div>
                 );
               })}
            </div>
          )}
        </section>

        {/* RECENTLY USED SERVICES SECTION */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full" />
            Recently Used Services
          </h2>
          {distinctServices.length === 0 ? (
             <p className="text-sm text-gray-400 italic">No services contacted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {distinctServices.slice(0, 8).map((svc) => (
                 <div key={svc._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 flex flex-col items-end gap-1">
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          svc.bookingStatus === 'completed' ? 'bg-green-100 text-green-700' :
                          svc.type === 'booked' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                       }`}>
                          {svc.bookingStatus || svc.type}
                       </span>
                    </div>

                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                       {svc.bookingStatus === 'completed' ? '✅' : '🔧'}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{svc.title}</h3>
                    <p className="text-xs text-gray-400 mb-6">{svc.category?.name || 'Home Service'}</p>
                    
                    <div className="flex flex-col gap-2">
                       {svc.type === 'booked' && svc.bookingStatus !== 'completed' && (
                          <button 
                            onClick={() => handleComplete(svc.bookingId)}
                            className="w-full py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition"
                          >
                             🏁 Mark Completed
                          </button>
                       )}
                       {svc.type === 'contacted' && svc.messageStatus === 'accepted' && !svc.bookingId && (
                          <Link 
                            to={`/billing/${svc._id}`}
                            className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold text-center hover:bg-indigo-700 transition"
                          >
                             💳 Proceed to Pay
                          </Link>
                       )}
                       <Link to={`/services/${svc._id}`} className="block text-center py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition">
                          View Details
                       </Link>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </section>

        {/* FEEDBACKS PENDING RESPONSE SECTION */}
        <section>
          <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
            <h2 className="text-xl font-bold text-rose-900 mb-2 flex items-center gap-3">
              <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">⭐</span>
              Rate Your Recent Experiences
            </h2>
            <p className="text-rose-700 text-sm mb-8 opacity-80">Help others by sharing your thoughts on services you've contacted recently.</p>
            
            {pendingReviewServices.length === 0 ? (
               <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <p className="text-sm font-bold text-rose-800">You're all caught up! No pending reviews.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {pendingReviewServices.map(svc => (
                   <div key={svc._id} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{svc.title}</p>
                        <p className="text-xs text-rose-500">Awaiting your feedback</p>
                      </div>
                      <Link to={`/feedback/${svc._id}`} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition">
                         Write Review
                      </Link>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default CustomerDashboard;

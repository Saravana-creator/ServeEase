import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceById, getServiceFeedbacks, createFeedback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Tag, DollarSign, Send, Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [service, setService] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [serviceRes, feedbacksRes] = await Promise.all([
        getServiceById(id),
        getServiceFeedbacks(id)
      ]);
      setService(serviceRes.data.data);
      setFeedbacks(feedbacksRes.data.data);
    } catch (err) {
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    setSubmitting(true);
    try {
      await createFeedback(id, { text: messageText });
      toast.success('Message sent to provider!');
      setMessageText('');
      fetchData(); // Refresh feedbacks
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!service) {
    return <div className="text-center py-20 text-xl font-bold text-slate-700">Service not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Service Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
         <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
            <div>
               <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold w-fit mb-3 flex items-center gap-1 border border-primary-100">
                  <Tag size={12} /> {service.category?.name}
               </div>
               <h1 className="text-4xl font-extrabold text-slate-900">{service.title}</h1>
            </div>
            <div className="text-right flex flex-col items-start md:items-end p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-emerald-800 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign size={16}/> Rate</span>
                <span className="text-4xl font-black text-emerald-600">${service.price}</span>
            </div>
         </div>
         
         <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-6 mt-4">
             <div className="flex items-center gap-2 text-slate-600">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-500" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Provider</p>
                    <p className="font-bold text-slate-800">{service.provider?.name}</p>
                 </div>
             </div>
             <div className="flex items-center gap-2 text-slate-600 border-l border-slate-100 pl-6">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <MapPin size={18} className="text-rose-500" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Location Coverage</p>
                    <p className="font-bold text-slate-800">{service.location}</p>
                 </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">About this service</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{service.description}</p>
            </div>

            {/* Read Feedbacks */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <MessageSquare className="text-primary-500" /> Feedback & Messages 
                   <span className="bg-slate-100 text-slate-600 text-sm px-2 py-1 rounded-full">{feedbacks.length}</span>
                </h2>
                
                {feedbacks.length === 0 ? (
                    <p className="text-slate-500 text-center p-6 bg-slate-50 rounded-2xl italic">No messages yet. Be the first to contact the provider!</p>
                ) : (
                    <div className="space-y-6">
                        {feedbacks.map(fb => (
                            <div key={fb._id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-primary-500 text-white rounded-full flex items-center justify-center text-xs">
                                            {fb.customer?.name?.charAt(0) || 'C'}
                                        </div>
                                        {fb.customer?.name || 'Anonymous Customer'}
                                    </h4>
                                    <span className="text-xs font-bold text-slate-400">
                                        {new Date(fb.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-600 pl-8">{fb.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Messaging Sidebar */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white sticky top-24">
                <h3 className="text-xl font-bold mb-2">Message Provider</h3>
                <p className="text-slate-400 text-sm mb-6">Have questions or want to hire them? Send a direct message.</p>

                {user ? (
                    user.role === 'customer' ? (
                       <form onSubmit={handleSendMessage} className="space-y-4">
                           <textarea
                               required
                               placeholder="Hi, I'm interested in..."
                               rows={4}
                               value={messageText}
                               onChange={(e) => setMessageText(e.target.value)}
                               className="w-full bg-slate-800 border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none placeholder-slate-500"
                           ></textarea>
                           <button 
                               type="submit"
                               disabled={submitting || !messageText.trim()}
                               className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                               {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Send Message</>}
                           </button>
                       </form>
                    ) : (
                        <div className="bg-slate-800 p-4 rounded-xl text-amber-200 text-sm border border-slate-700">
                           Providers cannot send feedback. You must be logged in as a Customer.
                        </div>
                    )
                ) : (
                    <div className="bg-slate-800 p-6 rounded-xl text-center border border-slate-700">
                        <p className="text-slate-300 font-medium mb-4">Please log in to contact this provider.</p>
                        <Link to="/login" className="inline-block bg-white text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors">Log In</Link>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;

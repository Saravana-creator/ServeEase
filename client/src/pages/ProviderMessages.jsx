import { useState, useEffect } from 'react';
import { getProviderFeedbacks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Loader2, Calendar, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProviderMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'provider') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await getProviderFeedbacks();
      setMessages(res.data.data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare size={32} />
        </div>
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Customer Messages</h1>
            <p className="text-slate-500">Read feedback and messages from prospective clients.</p>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={48} /></div>
      ) : messages.length === 0 ? (
         <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center">
             <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-700 mb-2">Inbox Empty</h3>
             <p className="text-slate-500 max-w-sm mx-auto">You haven't received any messages yet. Make sure your services are active and looking good!</p>
             <Link to="/manage-services" className="text-purple-600 font-bold mt-4 inline-block hover:underline">View my services</Link>
         </div>
      ) : (
         <div className="grid gap-6">
            {messages.map((msg, idx) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={msg._id} 
                    className="bg-white border text-left border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-8"
                >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
                                {msg.customer?.name?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900">{msg.customer?.name || 'Anonymous Customer'}</h3>
                                <a href={`mailto:${msg.customer?.email}`} className="text-sm font-bold text-purple-600 hover:underline">{msg.customer?.email}</a>
                            </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2 text-sm">
                            <span className="flex items-center gap-1 text-slate-400 font-medium">
                                <Calendar size={14} /> {new Date(msg.createdAt).toLocaleString()}
                            </span>
                            <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                                <LayoutTemplate size={14} /> {msg.service?.title || 'Deleted Service'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed relative">
                        {msg.text}
                    </div>
                </motion.div>
            ))}
         </div>
      )}
    </div>
  );
};

export default ProviderMessages;

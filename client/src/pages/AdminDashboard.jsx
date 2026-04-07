import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminCategories, approveCategory, deleteCategory, createCategory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, CheckCircle, XCircle, Loader2, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAdminCategories();
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveCategory(id);
      toast.success('Category approved!');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to approve category');
    }
  };

  const handleDeny = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category removed!');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to remove category');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await createCategory({ name: newCatName });
      toast.success('Category created and approved!');
      setNewCatName('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const pendingCategories = categories.filter(c => !c.isApproved);
  const approvedCategories = categories.filter(c => c.isApproved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <Shield size={32} />
        </div>
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Admin Center</h1>
            <p className="text-slate-500">Moderate platform content and users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PENDING CATEGORIES */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-between">
            Pending Categories
            <span className="bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full">
                {pendingCategories.length}
            </span>
          </h2>

          {loading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : pendingCategories.length === 0 ? (
             <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                All caught up! No pending category suggestions.
             </div>
          ) : (
             <div className="space-y-4">
               {pendingCategories.map((cat) => (
                 <motion.div key={cat._id} initial={{opacity:0}} animate={{opacity:1}} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <Tag className="text-slate-400" size={20} />
                        <div>
                            <p className="font-bold text-slate-800">{cat.name}</p>
                            <p className="text-xs text-slate-500">Suggested: {new Date(cat.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleApprove(cat._id)} className="bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white p-2 rounded-xl transition-all" title="Approve">
                            <CheckCircle size={20} />
                        </button>
                        <button onClick={() => handleDeny(cat._id)} className="bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all" title="Reject">
                            <XCircle size={20} />
                        </button>
                    </div>
                 </motion.div>
               ))}
             </div>
          )}
        </div>

        {/* APPROVED CATEGORIES */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-between">
            Active Categories
            <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full">
                {approvedCategories.length}
            </span>
          </h2>

          {loading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : (
             <>
               <form onSubmit={handleCreateCategory} className="mb-6 flex gap-3">
                 <input 
                   type="text"
                   value={newCatName}
                   onChange={(e) => setNewCatName(e.target.value)}
                   placeholder="Add new category directly..."
                   className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
                 />
                 <button 
                   type="submit"
                   disabled={!newCatName.trim()}
                   className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-xl flex items-center gap-2 font-bold text-sm transition-all disabled:opacity-50"
                 >
                   <Plus size={16} /> Add
                 </button>
               </form>

               <div className="grid grid-cols-2 gap-4">
                 {approvedCategories.map((cat) => (
                   <div key={cat._id} className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-900 truncate pr-2">{cat.name}</span>
                      <button onClick={() => handleDeny(cat._id)} className="text-rose-400 hover:text-rose-600 transition-colors" title="Delete">
                          <XCircle size={16} />
                      </button>
                   </div>
                 ))}
               </div>
             </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

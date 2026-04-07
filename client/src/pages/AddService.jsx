import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, DollarSign, MapPin, Tag, AlignLeft, Type } from 'lucide-react';
import { getCategories, createCategory, createService } from '../services/api';
import toast from 'react-hot-toast';

const AddService = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: ''
  });
  
  // Suggest Category State
  const [suggestingNew, setSuggestingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoadingCats(false);
    }
  };

  const handleSuggestCategory = async () => {
    if (!newCategoryName.trim()) return toast.error('Enter a category name');
    
    try {
      setLoading(true);
      const res = await createCategory({ name: newCategoryName });
      toast.success(res.data.message); // Will say "suggested and awaiting admin approval"
      setSuggestingNew(false);
      setNewCategoryName('');
      // Even though it's pending, we won't see it in public fetch. 
      // User must select another approved category for now, or we allow saving draft?
      // Based on PRD: "Stored and approved by Admin". 
      // For simplicity in UX: Tell them it's suggested, but they must pick an existing one or wait.
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to suggest category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error('Please select a category');
    
    try {
      setLoading(true);
      await createService({
        ...formData,
        price: Number(formData.price)
      });
      toast.success('Service published successfully!');
      navigate('/dashboard'); // Go back to dashboard after creating
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error publishing service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Create New Service</h1>
            <p className="text-slate-500">List your expertise and start earning instantly.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
           <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
               
               {/* Title */}
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Service Title</label>
                 <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Professional Plumbing Repair"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium transition-all"
                    />
                 </div>
               </div>

               {/* Description */}
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Description</label>
                 <div className="relative">
                    <AlignLeft className="absolute left-4 top-5 text-slate-400" size={18} />
                    <textarea 
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detail the services you provide, your experience..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
                    />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Price */}
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Price ($)</label>
                     <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="number" 
                            required
                            min="1"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="Amount"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        />
                     </div>
                   </div>

                   {/* Location */}
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Location Area</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g. San Francisco, CA"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        />
                     </div>
                   </div>
               </div>

               {/* Category Selection vs Suggestion */}
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                     <label className="text-sm font-bold text-slate-700">Category</label>
                     <button 
                        type="button" 
                        onClick={() => setSuggestingNew(!suggestingNew)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 transition"
                      >
                        {suggestingNew ? "Wait, I found my category" : "Category missing? Suggest one."}
                     </button>
                 </div>

                 {!suggestingNew ? (
                     <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none"
                            disabled={loadingCats}
                        >
                            <option value="">Select an approved category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                     </div>
                 ) : (
                     <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                         <h4 className="font-bold text-slate-900 mb-2">Suggest a Category</h4>
                         <p className="text-sm text-slate-500 mb-4">Admins need to approve new generic categories to keep the platform clean.</p>
                         <div className="flex gap-4">
                             <input 
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="e.g. Deep Cleaning"
                                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                             />
                             <button
                                type="button"
                                onClick={handleSuggestCategory}
                                disabled={loading || !newCategoryName.trim()}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-xl font-bold transition-colors disabled:opacity-50"
                             >
                                Submit
                             </button>
                         </div>
                     </div>
                 )}
               </div>

               <div className="pt-6 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading || suggestingNew}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && !suggestingNew ? <Loader2 className="animate-spin" /> : "Publish Service"}
                    </button>
                    {suggestingNew && <p className="text-center text-xs text-rose-500 font-bold mt-3">Please switch back to selecting an approved category to publish your service now.</p>}
               </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddService;

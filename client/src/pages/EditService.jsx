import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Loader2, DollarSign, MapPin, Tag, AlignLeft, Type, ArrowLeft } from 'lucide-react';
import { getCategories, getServiceById, updateService } from '../services/api';
import toast from 'react-hot-toast';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [serviceRes, categoriesRes] = await Promise.all([
        getServiceById(id),
        getCategories()
      ]);
      const s = serviceRes.data.data;
      setFormData({
        title: s.title,
        description: s.description,
        price: s.price,
        location: s.location,
        category: s.category._id
      });
      setCategories(categoriesRes.data.data);
    } catch (err) {
      toast.error('Failed to load service data');
      navigate('/manage-services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error('Please select a category');
    
    try {
      setSaving(true);
      await updateService(id, {
        ...formData,
        price: Number(formData.price)
      });
      toast.success('Service updated successfully!');
      navigate('/manage-services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/manage-services" className="text-slate-500 font-bold flex items-center gap-2 mb-6 hover:text-slate-800 w-fit">
         <ArrowLeft size={18} /> Back to My Services
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Edit Service</h1>
            <p className="text-slate-500">Update your service details and pricing.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
           <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Service Title</label>
                 <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium transition-all" />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Description</label>
                 <div className="relative">
                    <AlignLeft className="absolute left-4 top-5 text-slate-400" size={18} />
                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Price ($)</label>
                     <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="number" required min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Location Area</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                     </div>
                   </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Category</label>
                 <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none">
                        <option value="">Select an approved category</option>
                        {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-100">
                    <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
                    </button>
               </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditService;

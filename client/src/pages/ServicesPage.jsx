import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServices, getCategories } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import { Search, Filter, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const ServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        getServices(),
        getCategories()
      ]);
      setServices(servicesRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      setActiveFilters(cleanFilters);
      const res = await getServices(cleanFilters);
      setServices(res.data.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', location: '', maxPrice: '' });
    setActiveFilters({});
    fetchInitialData();
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Professional Services</h1>
            <p className="text-gray-500 max-w-lg">Discover top-rated experts for home repairs, maintenance, and expert consultations.</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <AnimatePresence>
            {showFilters && (
              <motion.aside 
                initial={{ opacity: 0, x: -20, width: 0 }} animate={{ opacity: 1, x: 0, width: 320 }} exit={{ opacity: 0, x: -20, width: 0 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-fit sticky top-24"
              >
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Filters</h3>
                   {Object.keys(activeFilters).length > 0 && (
                       <button onClick={clearFilters} className="text-xs text-rose-500 font-bold hover:underline">Clear all</button>
                   )}
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Search</label>
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})}
                        placeholder="Keyword..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Category</label>
                    <select 
                      value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Location</label>
                    <input 
                      type="text" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}
                      placeholder="City or area..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Max Budget (₹)</label>
                    <input 
                      type="number" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    />
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 active:scale-95">
                    Search Professionals
                  </button>
                </form>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="font-medium">Finding best matches...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                  {services.map((service, index) => (
                    <motion.div key={service._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceCard service={service} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 flex flex-col items-center">
                 <div className="bg-gray-50 p-8 rounded-full mb-6">
                    <Search size={48} className="text-gray-300" />
                 </div>
                 <h3 className="text-3xl font-extrabold text-gray-900 mb-2">No results found</h3>
                 <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">Try broadening your search criteria or clearing filters to see more professionals.</p>
                 <button onClick={clearFilters} className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                    <X size={18} /> Clear all filters
                 </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServicesPage;

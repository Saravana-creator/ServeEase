import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getServices, getCategories } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import { Search, Filter, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ServiceList = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
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
      // Clean empty filters before sending request
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await getServices(activeFilters);
      setServices(res.data.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', location: '', maxPrice: '' });
    fetchInitialData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            {user ? "Browse Services" : "Services Overview"}
          </h1>
          <p className="text-slate-500">
            {user ? "Find the right professional for your next project" : "Join or Log In to filter, search, and contact service providers."}
          </p>
        </div>
        
        {user && (
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-700 font-medium"
          >
            <Filter size={18} /> Filters
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Filter Sidebar - ONLY SHOW IF LOGGED IN */}
        {user && (
          <motion.div 
            className={`w-full md:w-80 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 ${showFilters ? 'block' : 'hidden md:flex'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold flex items-center gap-2"><Filter size={18}/> Filters</h3>
             {Object.values(filters).some(x => x !== '') && (
                 <button onClick={clearFilters} className="text-xs text-rose-500 font-bold hover:underline">Clear all</button>
             )}
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Keyword</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="What do you need?"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Location</label>
              <input 
                type="text" 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                placeholder="City or zip..."
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Max Price ($)</label>
              <input 
                type="number" 
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                placeholder="e.g. 500"
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>

            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-all shadow-md mt-2">
              Apply Filters
            </button>
          </form>
        </motion.div>
        )}

        {/* Results Grid - TAKES FULL WIDTH IF NO SIDEBAR */}
        <div className="flex-1">
          {!user ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {categories.map((cat, i) => (
                 <motion.div
                   key={cat._id}
                   whileHover={{ scale: 1.05 }}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:shadow-xl hover:border-primary-100 transition-all h-full"
                 >
                   <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-transform">
                     <span className="text-2xl font-bold text-primary-600">{cat.name.charAt(0)}</span>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                     {cat.name}
                   </h3>
                   <p className="text-slate-500 mt-2 text-sm">Professional {cat.name} Services</p>
                 </motion.div>
               ))}
             </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Finding best services for you...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 flex flex-col items-center">
               <div className="bg-slate-50 p-6 rounded-full inline-block mb-4">
                  <X size={40} className="text-slate-400" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">No services found</h3>
               <p className="text-slate-500 max-w-md mx-auto">We couldn't find anything matching your current filters. Try adjusting your search criteria or removing filters.</p>
               <button onClick={clearFilters} className="mt-6 text-primary-600 font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;

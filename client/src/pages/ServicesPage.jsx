import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import { SkeletonServiceCard } from '../components/SkeletonCard';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const ServiceCard = ({ service }) => (
  <motion.div variants={itemVariants}
    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.09)' }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col">
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">{service.category}</span>
      <span className="text-lg font-bold text-indigo-600">₹{service.price}</span>
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-3">{service.description}</p>
    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
      <span>📍 {service.location}</span>
      <span>👤 {service.provider?.name}</span>
    </div>
    <Link to={`/services/${service._id}`}
      className="block text-center py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
      View Details
    </Link>
  </motion.div>
);

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', location: '', minPrice: '', maxPrice: '' });
  const [applied, setApplied] = useState({});

  const fetchServices = async (f = {}) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const { data } = await api.get('/services', { params });
      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleApply = () => { setApplied(filters); fetchServices(filters); };
  const handleReset = () => {
    const empty = { category: '', location: '', minPrice: '', maxPrice: '' };
    setFilters(empty); setApplied(empty); fetchServices();
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} services available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="font-semibold text-gray-800 mb-4">Filters</h2>
              <div className="space-y-4">
                {[
                  { key: 'category', label: 'Category', placeholder: 'e.g. Plumbing' },
                  { key: 'location', label: 'Location', placeholder: 'e.g. Mumbai' },
                  { key: 'minPrice', label: 'Min Price (₹)', placeholder: '0', type: 'number' },
                  { key: 'maxPrice', label: 'Max Price (₹)', placeholder: '10000', type: 'number' },
                ].map(({ key, label, placeholder, type = 'text' }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input type={type} value={filters[key]} placeholder={placeholder}
                      onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                ))}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleApply}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Apply Filters
                </motion.button>
                <button onClick={handleReset} className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonServiceCard key={i} />)}
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 font-medium">No services found</p>
                <button onClick={handleReset} className="mt-3 text-sm text-indigo-600 hover:underline">Clear filters</button>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.map(svc => <ServiceCard key={svc._id} service={svc} />)}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServicesPage;

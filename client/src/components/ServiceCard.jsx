import { motion } from 'framer-motion';
import { MapPin, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service, index, isStatic = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group relative flex flex-col ${!isStatic ? 'hover:shadow-xl transition-all cursor-pointer' : ''}`}
    >
      <div className="p-6 flex-grow flex flex-col relative">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-[10px] font-bold w-fit flex items-center gap-1 border border-primary-100">
             <Tag size={10} />
             {service.category?.name || 'Uncategorized'}
          </div>
          <div className="flex items-center gap-1">
             {service.avgRating === 'No reviews yet' ? (
                <span className="text-[10px] text-slate-400 italic">No reviews yet</span>
             ) : (
                <>
                  <span className="text-amber-500 text-xs">⭐</span>
                  <span className="text-xs font-bold text-slate-700">{service.avgRating}</span>
                  <span className="text-[10px] text-slate-400">({service.reviewCount})</span>
                </>
             )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{service.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
        
        <div className="mt-auto space-y-3">
            <div className={`flex items-center text-slate-500 text-sm gap-2`}>
                <MapPin size={16} className="text-rose-500"/>
                {service.location}
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center text-slate-500 text-sm gap-2">
                    <User size={16} className="text-blue-500"/>
                    <span className="truncate max-w-[120px]">{service.provider?.name || 'Unknown'}</span>
                </div>
                <div className="text-lg font-extrabold text-primary-600">
                    ₹{service.price}
                </div>
            </div>
        </div>
      </div>

      {!isStatic && (
        <Link 
          to={`/services/${service._id}`} 
          className="absolute inset-0 z-10"
          aria-label={`View details for ${service.title}`}
        />
      )}
    </motion.div>
  );
};

export default ServiceCard;

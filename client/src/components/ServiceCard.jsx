import { motion } from 'framer-motion';
import { MapPin, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group relative flex flex-col"
    >
      <div className="h-48 bg-gradient-to-br from-primary-100 to-indigo-100 relative overflow-hidden flex items-center justify-center group-hover:from-primary-200 group-hover:to-indigo-200 transition-colors duration-500">
        <span className="text-6xl font-black text-primary-300/50 uppercase select-none tracking-widest">
          {service.category?.name?.substring(0, 3) || 'JOB'}
        </span>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-700 flex items-center gap-1 shadow-sm">
           <Tag size={14} className="text-primary-600"/>
           {service.category?.name || 'Uncategorized'}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{service.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
        
        <div className="mt-auto space-y-3">
            <div className="flex items-center text-slate-500 text-sm gap-2">
                <MapPin size={16} className="text-rose-500"/>
                {service.location}
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center text-slate-500 text-sm gap-2">
                    <User size={16} className="text-blue-500"/>
                    <span className="truncate max-w-[120px]">{service.provider?.name || 'Unknown'}</span>
                </div>
                <div className="text-lg font-extrabold text-primary-600">
                    ${service.price}
                </div>
            </div>
        </div>
      </div>

      <Link 
        to={`/services/${service._id}`} 
        className="absolute inset-0 z-10"
        aria-label={`View details for ${service.title}`}
      />
    </motion.div>
  );
};

export default ServiceCard;

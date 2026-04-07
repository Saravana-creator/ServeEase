import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-3 border-indigo-200 border-t-indigo-600 rounded-full`}
        style={{ borderWidth: 3 }}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

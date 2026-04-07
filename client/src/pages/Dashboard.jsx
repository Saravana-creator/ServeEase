import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Shield, PlusCircle, MessageSquare, List, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-slate-600">You are logged in as a <span className="text-primary-600 font-bold capitalize">{user?.role}</span></p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* Quick Actions based on Role */}
        {user?.role === 'provider' && (
          <>
            <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <PlusCircle className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Add New Service</h3>
              <p className="text-slate-500 mb-6">List a new service to start getting inquiries from customers.</p>
              <Link to="/services/add" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto w-fit">
                Get Started <PlusCircle size={18} />
              </Link>
            </motion.div>

            <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <List className="text-blue-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Manage Services</h3>
              <p className="text-slate-500 mb-6">View and edit your existing service listings.</p>
              <button className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View All <List size={18} />
              </button>
            </motion.div>

            <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">New</div>
              <MessageSquare className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Messages</h3>
              <p className="text-slate-500 mb-6">Respond to inquiries from potential customers.</p>
              <button className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View Messages <MessageSquare size={18} />
              </button>
            </motion.div>
          </>
        )}

        {user?.role === 'customer' && (
          <>
            <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <List className="text-indigo-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Browse Services</h3>
              <p className="text-slate-500 mb-6">Find the perfect expert for your home needs.</p>
              <Link to="/services" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto w-fit">
                Explore Now <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <MessageSquare className="text-cyan-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">My Enquiries</h3>
              <p className="text-slate-500 mb-6">Track your conversations with service providers.</p>
              <button className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View History <MessageSquare size={18} />
              </button>
            </motion.div>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <Shield className="text-rose-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Panel</h3>
              <p className="text-slate-500 mb-6">Manage users, moderate services, and approve categories.</p>
              <Link to="/admin" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto w-fit">
                Enter Admin <Shield size={18} />
              </Link>
            </motion.div>
          </>
        )}

        {/* Global Settings */}
        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <Settings className="text-slate-500 mb-4" size={32} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Account Settings</h3>
          <p className="text-slate-500 mb-6">Update your profile, password, and notification preferences.</p>
          <button className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Manage Account <Settings size={18} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

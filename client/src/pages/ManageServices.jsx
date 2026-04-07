import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getServices, deleteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';
import { PlusCircle, Loader2, X, Edit, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user || user.role !== 'provider') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchMyServices();
  }, [user.id]);

  const fetchMyServices = async () => {
    setLoading(true);
    try {
      const res = await getServices({ provider: user.id });
      setServices(res.data.data);
    } catch (err) {
      toast.error('Failed to load your services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteService(deleteId);
      toast.success('Service deleted successfully');
      setServices(services.filter(s => s._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete service');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Manage My Services</h1>
          <p className="text-slate-500">Edit or remove your listed offerings.</p>
        </div>
        <Link 
          to="/services/add"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <PlusCircle size={20} /> Add New Service
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600" size={48} /></div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 flex flex-col items-center shadow-sm">
           <div className="bg-slate-50 p-6 rounded-full inline-block mb-4">
              <X size={40} className="text-slate-400" />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 mb-2">No active services</h3>
           <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't listed any services yet. Create one to start reaching customers!</p>
           <Link to="/services/add" className="text-primary-600 font-bold flex items-center gap-2 hover:underline">
             Create Service <PlusCircle size={18} />
           </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-sm font-bold text-slate-600">Service Title</th>
                  <th className="p-4 text-sm font-bold text-slate-600">Category</th>
                  <th className="p-4 text-sm font-bold text-slate-600">Price</th>
                  <th className="p-4 text-sm font-bold text-slate-600">Location</th>
                  <th className="p-4 text-sm font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <Link to={`/services/${service._id}`} className="font-bold text-slate-800 hover:text-primary-600">
                        {service.title}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-bold">
                        {service.category?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600">₹{service.price}</td>
                    <td className="p-4 text-sm text-slate-600">{service.location}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Link 
                        to={`/services/edit/${service._id}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => setDeleteId(service._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!deleteId}
        title="Delete Service?"
        message="Are you sure you want to permanently remove this service? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
      />
    </div>
  );
};

export default ManageServices;

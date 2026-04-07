import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import { SkeletonStatCard } from '../components/SkeletonCard';

const GST_RATE = 0.18;
const LINE_ITEMS = [
  { label: 'Service Fee', flat: 0 },
  { label: 'Platform Convenience Fee', flat: 49 },
  { label: 'Inspection & Visit Charge', flat: 99 },
];

const SuccessModal = ({ service, total, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
    >
      {/* Confetti rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 3 + i, opacity: 0 }}
          transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full border-2 border-green-400 pointer-events-none"
        />
      ))}

      {/* Check icon */}
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10"
      >
        <motion.svg
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <motion.path d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful!</h2>
        <p className="text-gray-500 text-sm mb-1">Your booking is confirmed</p>
        <p className="text-indigo-600 font-semibold text-sm mb-4 truncate px-2">{service?.title}</p>

        <div className="bg-green-50 rounded-2xl px-5 py-3 mb-6 inline-block w-full">
          <p className="text-xs text-gray-500 mb-0.5">Amount Paid</p>
          <p className="text-3xl font-bold text-green-600">₹{total.toFixed(2)}</p>
        </div>

        <div className="bg-gray-50 rounded-xl px-4 py-3 text-left mb-6 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Booking ID</span>
            <span className="font-mono font-medium text-gray-700">
              SE{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Date</span>
            <span className="font-medium text-gray-700">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Status</span>
            <span className="text-green-600 font-semibold">Confirmed ✓</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Back to Services
        </motion.button>
      </motion.div>
    </motion.div>
  </motion.div>
);

const BillingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/services/${id}`)
      .then(({ data }) => setService(data.data))
      .catch(() => { toast.error('Service not found'); navigate('/services'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="animate-pulse h-6 w-32 bg-gray-200 rounded-lg" />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </PageTransition>
    );
  }

  if (!service) return null;

  const basePrice = service.price;
  const convenienceFee = LINE_ITEMS[1].flat;
  const visitCharge = LINE_ITEMS[2].flat;
  const subtotal = basePrice + convenienceFee + visitCharge;
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  const handlePay = async () => {
    setPaying(true);
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1800));
    setPaying(false);
    setSuccess(true);
  };

  const lineItems = [
    { label: 'Service Fee', amount: basePrice },
    { label: 'Platform Convenience Fee', amount: convenienceFee },
    { label: 'Inspection & Visit Charge', amount: visitCharge },
  ];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          ← Back
        </button>

        <div className="space-y-4">
          {/* Service Summary */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Service Summary</p>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                🔧
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-lg leading-tight">{service.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">{service.category?.name || 'Uncategorized'}</span>
                  <span className="text-xs text-gray-400">📍 {service.location}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{service.description}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                {service.provider?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-400">Provider</p>
                <p className="text-sm font-medium text-gray-800">{service.provider?.name}</p>
              </div>
            </div>
          </motion.div>

          {/* Price Breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Price Breakdown</p>

            <div className="space-y-3">
              {lineItems.map(({ label, amount }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-medium text-gray-800">₹{amount.toFixed(2)}</span>
                </motion.div>
              ))}

              <div className="border-t border-dashed border-gray-200 pt-3 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1.5">
                    GST
                    <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-semibold">18%</span>
                  </span>
                  <span className="text-sm font-medium text-orange-600">+₹{gst.toFixed(2)}</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="bg-indigo-50 rounded-xl px-4 py-3.5 flex items-center justify-between mt-2"
              >
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Payment Method (decorative) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Payment Method</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { icon: '💳', label: 'Credit / Debit Card', active: true },
                { icon: '📱', label: 'UPI', active: false },
                { icon: '🏦', label: 'Net Banking', active: false },
              ].map(({ icon, label, active }) => (
                <div key={label}
                  className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    active ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className={`text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-600'}`}>{label}</span>
                  {active && <span className="ml-auto w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handlePay}
              disabled={paying}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 disabled:opacity-70 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3"
            >
              {paying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Processing Payment…
                </>
              ) : (
                <>
                  <span>🔒</span>
                  Proceed to Pay ₹{total.toFixed(2)}
                </>
              )}
            </motion.button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔐 Secured by 256-bit SSL encryption · No charges stored
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <SuccessModal
            service={service}
            total={total}
            onClose={() => navigate('/services')}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BillingPage;

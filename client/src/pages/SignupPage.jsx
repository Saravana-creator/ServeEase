import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const validate = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Minimum 6 characters';
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'customer' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.token, data.user);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">SE</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Join ServeEase today</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input name={name} type={type} value={form[name]} onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                  {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="customer">Customer — looking for services</option>
                  <option value="provider">Service Provider — offering services</option>
                </select>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors mt-2">
                {loading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignupPage;

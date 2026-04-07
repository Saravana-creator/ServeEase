import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, Star, MapPin, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Hero = () => (
  <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-100/30 skew-x-12 -mr-32 -z-10" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Star size={14} fill="currentColor" /> Best local pros in one place
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
            Book trusted <br /> services in <span className="text-indigo-600">seconds.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            From emergency plumbing to routine house cleaning, discover and book verified professionals tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link to="/services" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
              Browse Professionals <ArrowRight size={20} />
            </Link>
            <Link to="/signup?role=provider" className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition shadow-sm text-center">
              Become a Provider
            </Link>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 relative hidden lg:block">
          <div className="bg-white rounded-3xl p-4 shadow-2xl relative z-10 border border-gray-100">
             <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                   <Zap size={20} fill="currentColor" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400">Response Rate</p>
                   <p className="text-sm font-black text-gray-900">98% within 1 hr</p>
                </div>
             </div>
             <img src="https://images.unsplash.com/photo-1517646273410-b9979bc6a422?auto=format&fit=crop&q=80&w=600" alt="Home Repair" className="rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Feature = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}
    className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition group"
  >
    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <PageTransition>
      <div className="pb-20">
        <Hero />
        
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Why choose ServeEase?</h2>
              <p className="text-gray-500">We prioritize quality, safety, and transparency in every booking you make.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
             <Feature icon={Shield} title="Verified Skills" desc="Every expert undergoes rigorous background and skill checks." delay={0.1} />
             <Feature icon={Search} title="Easy Discovery" desc="Find exactly who you need with advanced search and filters." delay={0.2} />
             <Feature icon={MapPin} title="Local Experts" desc="Top professionals right in your neighborhood for faster service." delay={0.3} />
           </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
             className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32" />
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                 <h2 className="text-4xl font-extrabold">Ready to experience better home services?</h2>
                 <p className="text-indigo-100 text-lg">Join thousands of happy customers and professionals on India's most trusted services platform.</p>
                 <div className="pt-6 flex flex-wrap justify-center gap-4">
                    <Link to="/signup" className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-gray-50 shadow-xl transition-all">Get Started</Link>
                    <Link to="/services" className="px-10 py-4 bg-transparent border-2 border-white/40 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">Explore Services</Link>
                 </div>
              </div>
           </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;

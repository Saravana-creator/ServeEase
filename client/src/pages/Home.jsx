import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Clock, MapPin, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left md:flex items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Your Home Services, <br />
                <span className="text-primary-600">Simplified.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-xl">
                Connect with verified local experts for everything from electrical repairs to home cleaning. Fast, reliable, and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Book a Service <ArrowRight size={20} />
                </Link>
                <Link
                  to="/signup?role=provider"
                  className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-50 transition-all text-center"
                >
                  Join as Provider
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block md:w-1/2"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl relative">
                  <div className="absolute -top-4 -right-4 bg-primary-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                    4.9/5 ⭐ Rated
                  </div>
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800"
                  alt="Professional Service"
                  className="rounded-2xl w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Shield className="text-primary-600" size={32} />,
                title: "Verified Experts",
                desc: "Every provider is background checked and verified for quality assurance."
              },
              {
                icon: <Clock className="text-primary-600" size={32} />,
                title: "On-Time Service",
                desc: "We value your time. Our providers arrive within the scheduled window."
              },
              {
                icon: <MapPin className="text-primary-600" size={32} />,
                title: "Local Excellence",
                desc: "Find the best high-rated professionals right in your neighborhood."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl border border-slate-100 hover:border-primary-100 hover:bg-primary-50 transition-all group"
              >
                <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

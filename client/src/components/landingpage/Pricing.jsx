import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate()
  function getstart(){
    navigate('/auth/signup')
  }
  const plans = [
    {
      name: 'Free Plan',
      description: 'All features available for students and educators',
      features: [
        'Unlimited team members',
        'All analytics & reporting',
        'Unlimited storage for notes and projects',
        'Priority support',
        'All integrations',
        'Custom workflows',
        'API access',
        'Mobile & web access',
        'Advanced security'
      ],
      color: 'from-blue-600 to-cyan-600',
      popular: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Free for
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent"> Everyone</span>
          </h2>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-12">
            Access all Zanly features for free. No hidden fees, no limitations, just pure learning.
          </p>
        </Motion.div>

        <Motion.div
          className="grid grid-cols-1 md:grid-cols-1 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <Motion.div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-200 scale-105`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="text-center mb-8">
                <Motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Zap className="w-8 h-8 text-white" />
                </Motion.div>

                <h3 className="text-2xl font-bold text-zinc-900 mb-2">{plan.name}</h3>
                <p className="text-zinc-600 mb-6">{plan.description}</p>

                <Motion.button
                onClick={getstart}
                  className="w-full py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started for Free
                </Motion.button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-zinc-900 mb-4">All features included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <Motion.div
                    key={feature}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                  >
                    <Check className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0" />
                    <span className="text-zinc-600">{feature}</span>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          ))}
        </Motion.div>

        <Motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-zinc-600 mb-6">
            No credit card required. Just sign up and start learning today!
          </p>
        </Motion.div>
      </div>
    </section>
  );
};

export default Pricing;

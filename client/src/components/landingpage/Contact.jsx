import React, { useState } from 'react';
import { motion as Motion} from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Send, Clock, Users } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', data);
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'zanlykashmir@gmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 9149522458',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Zanly Pattan',
      description: 'Baramulla, J&K 193121'
    }
  ];

  const stats = [
    { icon: Clock, value: '< 24h', label: 'Response Time' },
    { icon: Users, value: '10k+', label: 'Happy Students' },
    { icon: Mail, value: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Contact us for
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent"> Queries</span>
          </h2>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
           Let’s make studying easier with Zanly. Contact our team today and unlock smarter learning!
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Motion.div
            className="bg-white rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-zinc-900 mb-8">Send us a message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Motion.input
                    type="text"
                    placeholder="Your Name"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    {...register('name')}
                    whileFocus={{ scale: 1.02 }}
                  />
                  {errors.name && (
                    <Motion.p
                      className="text-red-500 text-sm mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.name.message}
                    </Motion.p>
                  )}
                </div>

                <div className="relative">
                  <Motion.input
                    type="email"
                    placeholder="Your Email"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    {...register('email')}
                    whileFocus={{ scale: 1.02 }}
                  />
                  {errors.email && (
                    <Motion.p
                      className="text-red-500 text-sm mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email.message}
                    </Motion.p>
                  )}
                </div>
              </div>


              <div className="relative">
                <Motion.textarea
                  rows={6}
                  placeholder="Tell us about your issue..."
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 resize-none ${
                    errors.message 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  {...register('message')}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.message && (
                  <Motion.p
                    className="text-red-500 text-sm mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.message.message}
                  </Motion.p>
                )}
              </div>

              <Motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                )}
              </Motion.button>
            </form>
          </Motion.div>

          {/* Contact Info */}
          <Motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-8">Get in touch</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Motion.div
                    key={info.title}
                    className="flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 mb-1">{info.title}</h4>
                      <p className="text-blue-700 font-medium mb-1">{info.content}</p>
                      <p className="text-zinc-600 text-sm">{info.description}</p>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <Motion.div
              className="bg-gradient-to-br from-blue-700 to-cyan-500 rounded-3xl p-8 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h4 className="text-xl font-bold mb-6">Why choose us?</h4>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <Motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>

            {/* Map Placeholder */}
            <Motion.div
              className="bg-slate-200 rounded-2xl h-64 flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center text-zinc-600">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">PATTAN, J&K</p>
              </div>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
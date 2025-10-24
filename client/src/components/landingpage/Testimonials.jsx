import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import dummy from '../../assets/dummy.jpg';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Rahil Khan',
      role: '12th Science Student',
      avatar: dummy,
      content: 'Zanly helped me ace my board exams! The video lessons and mock tests made revision so much easier.',
      rating: 5,
      metric: '95% in final exams'
    },
    {
      id: 2,
      name: 'Abrar Bhat',
      role: 'Undergraduate Engineering Student',
      avatar: dummy,
      content: 'With Zanly’s notes and project guides, I completed my semester projects efficiently and scored top marks.',
      rating: 5,
      metric: 'Top 5% in class'
    },
    {
      id: 3,
      name: 'Aadil Ali',
      role: '10th Student',
      avatar: dummy,
      content: 'The organized notes and practice papers saved me hours of study time. I feel confident for exams now.',
      rating: 5,
      metric: '90% improvement in weak subjects'
    },
    {
      id: 4,
      name: 'Mr. Mushtaq Ahmad',
      role: 'Math Teacher',
      avatar: dummy,
      content: 'Zanly’s platform makes it easy for my students to revise effectively. The interactive lessons engage them thoroughly.',
      rating: 5,
      metric: '100+ students improved'
    },
    {
      id: 5,
      name: 'Raj Agarwal',
      role: 'Postgraduate Researcher',
      avatar: dummy,
      content: 'Zanly’s research guides and templates streamlined my thesis writing process. Highly recommend for postgraduates.',
      rating: 5,
      metric: 'Thesis completed 2 months early'
    }
  ];

  const partnerLogos = [
    { name: 'Jkbose', logo: 'JKBOSE' },
    { name: 'NCERT', logo: 'NCERT' },
    { name: 'CBSE', logo: 'CBSE' },
    { name: 'ICSE', logo: 'ICSE' },
    { name: 'Delhi University', logo: 'DU' },
    { name: 'IIT Bombay', logo: 'IITB' },
    { name: 'Khan Academy', logo: 'Khan Academy' },
    { name: 'BYJU\'s', logo: 'BYJU\'s' },
    { name: 'Coursera', logo: 'Coursera' },
    { name: 'EdX', logo: 'EdX' }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 mb-4 md:mb-6">
            Loved by
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent"> Thousands of Students</span>
          </h2>
          <p className="text-md sm:text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto">
            See how students and educators achieve academic excellence with Zanly.
          </p>
        </Motion.div>

        {/* Main Testimonial */}
        <div className="relative mb-16 md:mb-20 flex flex-col items-center">
          <div
            className="flex items-center justify-center w-full mb-6 md:mb-10"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 mr-4 md:mr-6 hover:bg-blue-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 md:w-6 h-5 md:h-6 text-blue-700" />
            </button>

            <div className="flex-1 max-w-xl sm:max-w-2xl md:max-w-3xl mx-2 md:mx-4">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentIndex}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Quote className="w-10 sm:w-12 h-10 sm:h-12 text-blue-200 mb-4 sm:mb-6" />

                  <blockquote className="text-sm sm:text-base md:text-lg text-zinc-700 leading-relaxed mb-6 md:mb-8 font-medium">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 text-sm sm:text-base md:text-lg">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-zinc-600 text-xs sm:text-sm">{testimonials[currentIndex].role}</div>
                        <div className="flex items-center mt-1">
                          {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                            <Star key={i} className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
                        {testimonials[currentIndex].metric}
                      </div>
                      <div className="text-xs sm:text-sm text-zinc-500">Achievement</div>
                    </div>
                  </div>
                </Motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 ml-4 md:ml-6 hover:bg-blue-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 md:w-6 h-5 md:h-6 text-blue-700" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex flex-wrap justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-200 rounded-full ${
                  index === currentIndex ? 'bg-blue-700 w-8 h-2 sm:h-2.5' : 'bg-slate-300 w-3 h-2 sm:h-2.5 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Partner Logos */}
        <Motion.div
          className="border-t border-slate-200 pt-12 md:pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-center text-zinc-500 mb-8 md:mb-12 text-sm sm:text-base">
            Trusted by schools, universities, and online education platforms
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6 md:gap-8 items-center justify-items-center">
            {partnerLogos.map((partner, index) => (
              <Motion.div
                key={partner.name}
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-base md:text-lg font-bold text-zinc-400 hover:text-zinc-600 transition-colors duration-200 text-center">
                  {partner.logo}
                </div>
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

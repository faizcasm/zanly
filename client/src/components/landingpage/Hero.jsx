import React from "react";
import { motion as Motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate()
  function access(){
    navigate('/auth/signup')
  }
  const clientLogos = [
  "Below-Matric Classes",
  "Matric/10th",
  "Intermediate/12th",
  "Undergraduate",
  "Graduate",
  "Postgraduate"
];


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-4 sm:top-20 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 w-52 h-52 sm:w-96 sm:h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="text-center">
          <Motion.div
            className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 fill-current" />
           Trusted by students throughout Kashmir
          </Motion.div>

          <Motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 mb-4 sm:mb-6 leading-snug sm:leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering every student with the right study material
            <br />
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              anytime, anywhere
            </span>
          </Motion.h1>

          <Motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Zanly makes learning effortless – access curated study materials, master concepts quickly, and achieve top results with ease.
          </Motion.p>

          <Motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Motion.button
            onClick={access}
              className="bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center group w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Access
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Motion.button>

            <Motion.button
              className="flex items-center px-6 sm:px-8 py-3 sm:py-4 text-zinc-700 hover:text-blue-700 font-semibold text-base sm:text-lg transition-all duration-200 group w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg mr-2 sm:mr-3 group-hover:shadow-xl transition-all duration-200">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 ml-0.5 sm:ml-1" />
              </div>
              Watch Demo
            </Motion.button>
          </Motion.div>

          {/* Social Proof */}
          <Motion.div
            className="border-t border-slate-200 pt-8 sm:pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6">
              Trusted by students
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-60">
              {clientLogos.map((logo, index) => (
                <Motion.div
                  key={logo}
                  className="text-lg sm:text-2xl font-bold text-zinc-400 hover:text-zinc-600 transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {logo}
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <Motion.div
        className="absolute top-1/4 left-4 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full"
        animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <Motion.div
        className="absolute top-1/3 right-6 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 bg-cyan-400 rounded-full"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </section>
  );
};

export default Hero;

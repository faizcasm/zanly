import React from "react";
import { motion as Motion } from "framer-motion";
import { Book, Zap, Shield, BarChart3, Users, Rocket } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Book,
      title: "Curated Study Material",
      description:
        "Access comprehensive and high-quality notes, guides, and resources for every subject and class level.",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Zap,
      title: "Quick Revision",
      description:
        "Revise concepts quickly with summarized notes and practice exercises to reinforce learning efficiently.",
      color: "from-cyan-500 to-cyan-700",
    },
    {
      icon: Shield,
      title: "Trusted Content",
      description:
        "All study materials are verified and curated by experienced educators to ensure reliability and accuracy.",
      color: "from-green-500 to-green-700",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Track your learning progress and identify strengths and weaknesses with easy-to-understand performance insights.",
      color: "from-blue-600 to-cyan-600",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description:
        "Join study groups, discuss problems with peers, and learn together to achieve better results.",
      color: "from-cyan-600 to-blue-600",
    },
    {
      icon: Rocket,
      title: "Exam Ready",
      description:
        "Prepare for exams with mock tests, quizzes, and timed practice sessions to boost confidence and scores.",
      color: "from-purple-600 to-pink-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <Motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-900 mb-4 sm:mb-6">
            Key Features of{" "}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Zanly
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl sm:max-w-3xl mx-auto">
            Everything students need to study smarter, revise faster, and excel academically.
          </p>
        </Motion.div>

        {/* Features Grid */}
        <Motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <Motion.div
              key={feature.title || index}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200"
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative">
                <Motion.div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </Motion.div>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </Motion.div>
          ))}
        </Motion.div>

        {/* CTA Button */}
        <Motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Motion.button
            className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
          </Motion.button>
        </Motion.div>
      </div>
    </section>
  );
};

export default Features;

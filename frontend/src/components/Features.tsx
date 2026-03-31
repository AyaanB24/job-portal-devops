import { motion } from "framer-motion";
import { Search, UserPlus, FileCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="h-8 w-8 text-blue-400" />,
    title: "Create Account",
    description: "Join our platform and complete your professional profile with your unique skills."
  },
  {
    icon: <Search className="h-8 w-8 text-teal-400" />,
    title: "Search Jobs",
    description: "Filter through thousands of jobs from startups to Fortune 500 companies."
  },
  {
    icon: <FileCheck className="h-8 w-8 text-purple-400" />,
    title: "Apply Quickly",
    description: "Submit your application with a single click and track progress in real-time."
  },
  {
    icon: <Rocket className="h-8 w-8 text-orange-400" />,
    title: "Start Career",
    description: "Connect with recruiters, land your dream job, and launch your career."
  }
];

const Features = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4"
          >
            How it works
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            Launch your career in <span className="text-gradient">4 simple steps</span>
          </motion.h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative group h-full"
            >
              <div className="h-full glass-card p-10 rounded-3xl border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-500 group-hover:scale-105 group-hover:translate-y-[-10px] shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 select-none pointer-events-none">
                  0{i + 1}
                </div>
                
                <div className="h-16 w-16 mb-8 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

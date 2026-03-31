import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Senior Developer",
    text: "I found my dream job as a Fullstack Engineer through this portal in just 2 weeks! The interface is so smooth.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    name: "Samantha Lee",
    role: "Product Designer",
    text: "The best job portal I have ever used. The glassmorphism design and the search experience are truly elite.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    name: "Marcus Aurelius",
    role: "DevOps Engineer",
    text: "Top tier companies and a seamless application process. Highly recommended for professionals in tech.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
  }
];

const Testimonials = () => {
  return (
    <div className="py-24 relative">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
      
      <div className="container px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-teal-400 font-bold tracking-widest uppercase text-sm"
          >
            Testimonials
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white"
          >
            What our <span className="text-gradient">users say</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-10 rounded-[2.5rem] border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-8 right-8 h-10 w-10 text-white/10 group-hover:text-blue-500/20 transition-colors" />
              
              <div className="flex items-center gap-5 mb-8">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-colors">
                  <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white group-hover:text-gradient transition-all">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
              
              <p className="text-lg text-white/80 italic leading-relaxed">
                "{t.text}"
              </p>

              <div className="flex gap-1 mt-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

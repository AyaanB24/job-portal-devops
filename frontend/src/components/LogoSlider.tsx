import { motion } from "framer-motion";

const companies = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Tesla", "Stripe", "NextJS", "Netflix", "Spotify"
];

const LogoSlider = () => {
  return (
    <div className="py-20 overflow-hidden relative border-t border-b border-white/5 bg-slate-950/20 backdrop-blur-3xl">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
          Trusted by over <span className="text-gradient">1,000+</span> top companies
        </h2>
        <div className="h-1 w-12 bg-blue-500 rounded-full mx-auto" />
      </div>

      <div className="flex gap-20 items-center justify-center animate-infinite-scroll">
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center whitespace-nowrap min-w-max"
        >
          {/* Duplicate the logos for infinite effect */}
          {[...companies, ...companies].map((name, i) => (
            <div 
              key={i} 
              className="text-3xl font-extrabold text-white/20 hover:text-white/60 transition-all duration-300 font-poppins tracking-tighter cursor-default"
            >
              {name.toUpperCase()}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fade Overlays */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
    </div>
  );
};

export default LogoSlider;

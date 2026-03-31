import { useState } from "react";
import { Search, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface HeroProps {
  onSearch: (query: string) => void;
  onLocationFilter: (location: string) => void;
}

const Hero = ({ onSearch, onLocationFilter }: HeroProps) => {
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState("");

  const handleSearch = () => {
    onSearch(query);
    onLocationFilter(loc);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-[10%] hidden lg:block"
      >
        <div className="glass-card p-4 rounded-2xl border-white/10 shadow-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">New Featured Job</p>
            <p className="text-sm font-bold text-white">Fullstack Engineer</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-[10%] hidden lg:block"
      >
        <div className="glass-card p-4 rounded-2xl border-white/10 shadow-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remote Opportunities</p>
            <p className="text-sm font-bold text-white">+500 Jobs Found</p>
          </div>
        </div>
      </motion.div>

      <div className="container relative z-10 text-center space-y-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Over 10,000+ jobs are waiting for you
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Find Your <span className="text-gradient">Dream Job</span> <br />
            in the Modern Era.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with the world's most innovative companies and take your career to the next level with our premium job matching platform.
          </p>
        </motion.div>

        {/* Search Bar Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card p-2 md:p-3 rounded-[2rem] border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Job title, company, or keywords"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 md:h-16 bg-transparent border-none text-lg text-white placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10 mx-2" />
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Location (e.g. Remote)"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="pl-12 h-14 md:h-16 bg-transparent border-none text-lg text-white placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg" 
              className="w-full md:w-auto h-14 md:h-16 px-10 rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-lg font-bold shadow-xl shadow-blue-500/20 group transition-all"
            >
              Search Jobs
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-muted-foreground">
            <span>Popular:</span>
            {["Frontend", "Product Design", "DevOps", "AI Engineer"].map((tag) => (
              <button 
                key={tag} 
                onClick={() => { setQuery(tag); onSearch(tag); }}
                className="hover:text-white transition-colors border-b border-white/10 pb-0.5"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

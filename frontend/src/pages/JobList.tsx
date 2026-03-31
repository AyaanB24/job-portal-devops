import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import JobCard from "@/components/JobCard";
import { SkeletonCard } from "@/components/Loader";
import { Briefcase, SlidersHorizontal, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket";
import Hero from "@/components/Hero";
import LogoSlider from "@/components/LogoSlider";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import { motion, AnimatePresence } from "framer-motion";

const JobList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => apiService.getJobs(),
  });

  useEffect(() => {
    socketService.onNewJob(() => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    });
  }, [queryClient]);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesLocation =
      !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Global Background Visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[180px] -z-10 animate-pulse delay-700" />
      </div>

      {/* Hero Section */}
      <Hero 
        onSearch={(query) => setSearch(query)} 
        onLocationFilter={(loc) => setLocationFilter(loc)} 
      />

      <LogoSlider />

      <Features />

      {/* Jobs Section */}
      <section id="jobs" className="py-24 relative container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider"
            >
              <Sparkles className="h-4 w-4" /> Latest Opportunities
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-white"
            >
              Featured <span className="text-gradient">Job Openings</span>
            </motion.h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 transition-all"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Results Info */}
        {!isLoading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-8 font-medium tracking-wide flex items-center gap-2 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Showing <span className="text-white font-bold">{filtered.length}</span> results tailored for you
          </motion.p>
        )}

        {/* Active Filter Display */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 rounded-3xl border-white/10 mb-12 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-400 uppercase tracking-widest pl-1">Search Keywords</label>
                  <input 
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 px-5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-blue-500/50 transition-colors outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-teal-400 uppercase tracking-widest pl-1">Location preference</label>
                  <input 
                    type="text"
                    placeholder="Filter by location (e.g. Remote)..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full h-12 px-5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-teal-500/50 transition-colors outline-none"
                  />
                </div>
             </div>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="relative">
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 space-y-6 glass-card rounded-[3rem] border-white/5"
            >
              <div className="h-24 w-24 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Briefcase className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">No matches found</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any jobs matching your current search parameters. Try broadening your keywords.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => { setSearch(""); setLocationFilter(""); }}
                className="h-12 border-white/10 hover:bg-white/10 rounded-xl"
              >
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 container px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-teal-500 p-12 md:p-20 text-center shadow-2xl shadow-blue-500/30"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Ready to take the <br /> next step?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Create your account today and start applying to the world's most innovative tech companies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-blue-600 hover:bg-slate-100 text-xl font-bold shadow-2xl shadow-black/10 group">
                Join Now <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-white/40 bg-transparent text-white hover:bg-white/10 text-xl font-bold">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default JobList;


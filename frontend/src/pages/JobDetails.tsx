import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Briefcase, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      apiService.getJobById(id).then((data) => {
        setJob(data || null);
        setLoading(false);
      });
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader />;

  if (!job) {
    return (
      <div className="container py-32 text-center space-y-6">
        <div className="h-20 w-20 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mx-auto">
          <Briefcase className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold text-white">Job not found</h2>
        <Link to="/jobs">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
            Back to Openings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative">
      <div className="container max-w-5xl px-4">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors mb-8 uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border-white/5 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-6 items-center">
                  <div className="h-20 w-20 rounded-3xl bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-3xl text-gradient shrink-0">
                    {job.companyName?.[0] || job.company?.[0] || "J"}
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{job.title}</h1>
                    <p className="text-xl text-blue-400 font-bold">{job.companyName || job.company}</p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-3">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5 text-white">
                        <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5 text-white">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-muted-foreground font-medium pb-8 border-b border-white/5">
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-sm">
                  <MapPin className="h-4 w-4 text-blue-400" />{job.location}
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-sm">
                  <Clock className="h-4 w-4 text-teal-400" />Posted {job.postedAt}
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-sm">
                  <Users className="h-4 w-4 text-purple-400" />{job.applicants} applicants
                </span>
                {job.salary && (
                  <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-sm">
                    <DollarSign className="h-4 w-4 text-orange-400" />{job.salary}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-blue-500 rounded-full" />
                  About the role
                </h2>
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-line bg-slate-900/40 p-8 rounded-3xl border border-white/5 italic">
                  {job.description}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="h-8 w-1.5 bg-teal-500 rounded-full" />
                   Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((s) => (
                    <span 
                      key={s} 
                      className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 text-blue-300 font-bold uppercase tracking-widest text-xs hover:border-blue-500/50 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar / Sidebar Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 sticky top-32">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Job Summary</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-muted-foreground font-medium">Job Type</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-none px-4 py-1 font-bold">{job.type}</Badge>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-muted-foreground font-medium">Location</span>
                  <span className="text-white font-bold">{job.location}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                   <span className="text-muted-foreground font-medium">Posted</span>
                   <span className="text-white font-bold text-sm uppercase">{job.postedAt}</span>
                </div>
              </div>

              <div className="space-y-4">
                {job.applicationStatus ? (
                  <Button variant="secondary" size="lg" className="w-full h-16 rounded-2xl bg-white/5 text-muted-foreground border-white/5 text-lg font-bold" disabled>
                    Already Applied
                  </Button>
                ) : (
                  <Link to={`/apply/${job.id}`}>
                    <Button size="lg" className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-lg font-bold shadow-2xl shadow-blue-500/20 group uppercase tracking-widest">
                      Apply Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                <p className="text-center text-xs text-muted-foreground font-medium px-4">
                  By clicking apply, you agree to share your profile with <span className="text-white font-bold">{job.companyName || job.company}</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px] -z-10" />
    </div>
  );
};

export default JobDetails;


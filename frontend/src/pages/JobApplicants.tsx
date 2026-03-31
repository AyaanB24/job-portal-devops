import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Application } from "@/types/Application";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  XCircle,
  Users,
  CircleDashed,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (jobId) {
      apiService.getJobById(jobId).then(job => {
        if (job) setJobTitle(job.title);
      });
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const data = await apiService.getCompanyApplicants();
      const filtered = data.filter(app => app.jobId === jobId);
      setApplicants(filtered);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await apiService.updateApplicationStatus(appId, newStatus);
      toast({ title: "Status Updated", description: `Application is now ${newStatus.replace('_', ' ')}` });
      setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus as any } : app));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white shrink-0 shadow-2xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Users className="h-3.5 w-3.5" /> Candidate Management
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Review <span className="text-gradient">Applicants</span></h1>
            <p className="text-muted-foreground font-medium italic">Managing talent for <span className="text-white font-bold underline decoration-blue-500/50 decoration-2 underline-offset-4">{jobTitle}</span></p>
          </div>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-card px-6 py-4 rounded-2xl border-white/5 bg-slate-900/40 flex items-center gap-4"
        >
           <div className="h-10 w-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-teal-400" />
           </div>
           <div>
              <p className="text-2xl font-black text-white leading-none">{applicants.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Total Candidates</p>
           </div>
        </motion.div>
      </div>

      {applicants.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 glass-card rounded-[3rem] border-white/5 space-y-6"
        >
          <div className="h-24 w-24 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No applications yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">This listing hasn't received any applicants yet. Share the listing to attract talent.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-8">
          <AnimatePresence>
            {applicants.map((app, i) => (
              <motion.div 
                key={app.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative glass-card p-8 md:p-10 rounded-[2.5rem] border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-bl-[12rem] -mr-32 -mt-32 group-hover:bg-teal-500/10 transition-colors duration-700" />
                
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex items-start gap-8 min-w-0">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-black text-3xl shadow-inner group-hover:scale-110 transition-transform">
                      {app.applicant?.name?.charAt(0) || "A"}
                    </div>
                    <div className="space-y-3 min-w-0 flex-1">
                      <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                        {app.applicant?.name || "Anonymous Applicant"}
                      </h3>
                      <div className="flex flex-wrap gap-5 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest text-[10px]"><Mail className="h-3.5 w-3.5 text-blue-400" />{app.applicant?.email}</span>
                        {app.phoneNumber && <span className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest text-[10px]"><Phone className="h-3.5 w-3.5 text-teal-400" />{app.phoneNumber}</span>}
                        {app.experienceYears && <span className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest text-[10px] font-black"><Briefcase className="h-3.5 w-3.5" />{app.experienceYears} Years Experience</span>}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 shrink-0">
                    <div className="glass-card bg-slate-950/50 p-6 rounded-2xl border-white/5 space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Evaluation Status</p>
                       <Select 
                        value={app.status} 
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                      >
                        <SelectTrigger className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
                           <div className="flex items-center gap-2">
                              <CircleDashed className="h-4 w-4 animate-spin-slow" />
                              <SelectValue placeholder="Update Status" />
                           </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-white/10 bg-slate-900/95 backdrop-blur-2xl">
                          <SelectItem value="PENDING" className="text-amber-400 font-black py-3 uppercase tracking-widest text-[10px] hover:bg-white/5">Pending Review</SelectItem>
                          <SelectItem value="UNDER_REVIEW" className="text-blue-400 font-black py-3 uppercase tracking-widest text-[10px] hover:bg-white/5">Under Review</SelectItem>
                          <SelectItem value="SHORTLISTED" className="text-emerald-400 font-black py-3 uppercase tracking-widest text-[10px] hover:bg-white/5">Shortlisted</SelectItem>
                          <SelectItem value="REJECTED" className="text-rose-400 font-black py-3 uppercase tracking-widest text-[10px] hover:bg-white/5">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="relative mt-10 pt-10 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                        <UserCheck className="h-4 w-4" /> Professional Statement
                    </h4>
                    <div className="text-lg text-muted-foreground/80 italic leading-relaxed bg-slate-950/40 p-10 rounded-[2rem] border border-white/5 relative">
                       <span className="absolute top-4 left-6 text-6xl text-white/5 font-serif leading-none">"</span>
                       {app.coverLetter || "The candidate did not provide a professional statement."}
                       <span className="absolute bottom-4 right-6 text-6xl text-white/5 font-serif leading-none rotate-180">"</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 flex items-center gap-2">
                         <LinkIcon className="h-4 w-4" /> Application Artifacts
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a 
                        href={app.resumeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/50 group/btn transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <ExternalLink className="h-5 w-5 text-blue-400" />
                            </div>
                            <span className="text-sm font-bold text-white uppercase tracking-widest">Resume</span>
                         </div>
                         <ArrowLeft className="h-4 w-4 text-white/20 group-hover/btn:text-blue-400 rotate-180 transition-colors" />
                      </a>

                      {app.portfolioUrl && (
                        <a 
                          href={app.portfolioUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-teal-500/10 hover:border-teal-500/50 group/btn transition-all"
                        >
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                                  <LinkIcon className="h-5 w-5 text-teal-400" />
                              </div>
                              <span className="text-sm font-bold text-white uppercase tracking-widest">Portfolio</span>
                           </div>
                           <ArrowLeft className="h-4 w-4 text-white/20 group-hover/btn:text-teal-400 rotate-180 transition-colors" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-2 pt-2">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                            <Clock className="h-3.5 w-3.5" /> Received {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                        </div>
                        <Badge variant="outline" className="border-white/10 text-white/40 uppercase text-[9px] px-3 font-bold">Encrypted Data</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;


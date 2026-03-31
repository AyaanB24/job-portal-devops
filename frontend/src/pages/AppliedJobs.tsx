import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Application } from "@/types/Application";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, CheckCircle2, Info, Calendar, Phone, Briefcase as BriefcaseIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket";

const statusColors: any = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SHORTLISTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const AppliedJobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: () => apiService.getApplications(),
  });

  useEffect(() => {
    socketService.onApplicationStatusUpdate((app: any) => {
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      
      const formattedStatus = app.status.replace('_', ' ');
      toast({
        title: "Application Updated",
        description: `Your application for ${app.job?.title || 'a position'} is now ${formattedStatus}`,
      });
    });
  }, [queryClient, toast]);

  if (isLoading) return <Loader />;

  return (
    <div className="container max-w-5xl py-12 space-y-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest">
          <Calendar className="h-3.5 w-3.5" /> Track Progress
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Your <span className="text-gradient">Applications</span></h1>
      </motion.div>

      {applications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 glass-card rounded-[3rem] border-white/5 space-y-6"
        >
          <div className="h-24 w-24 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <BriefcaseIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No applications yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">Start your journey today by applying to top-tier companies on our platform.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-8">
          <AnimatePresence>
            {applications.map((app, i) => (
              <motion.div 
                key={app.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative glass-card p-8 rounded-[2.5rem] border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-bl-[10rem] -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/5">
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {app.jobTitle}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap text-muted-foreground mt-1">
                        <span className="font-bold text-white/70">{app.companyName || (app as any).company}</span>
                        <span className="h-1 w-1 bg-white/20 rounded-full" />
                        <span className="text-sm">Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        {app.jobStatus === 'DELETED' && (
                          <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/20 bg-red-400/5 py-0.5 px-3 rounded-full uppercase font-black tracking-widest leading-none">
                            Listing Closed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border shadow-xl backdrop-blur-md ${statusColors[app.status]}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-blue-400 tracking-[0.2em]">Contact Details</p>
                    <p className="text-white font-medium flex items-center gap-2">
                       <Phone className="h-4 w-4 text-muted-foreground" /> {app.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-teal-400 tracking-[0.2em]">Years of Experience</p>
                    <p className="text-white font-medium flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" /> {app.experienceYears ? `${app.experienceYears} Years` : "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em]">Materials Submitted</p>
                     <div className="flex flex-wrap gap-3">
                       <a 
                         href={app.resumeLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-2 text-xs font-extrabold text-blue-400 hover:text-white bg-blue-400/10 hover:bg-blue-500 px-4 py-2 rounded-xl border border-blue-400/20 h-10 transition-all font-poppins"
                       >
                         <FileText className="h-4 w-4" /> RESUME
                       </a>
                       {app.portfolioUrl && (
                         <a 
                           href={app.portfolioUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 text-xs font-extrabold text-teal-400 hover:text-white bg-teal-400/10 hover:bg-teal-500 px-4 py-2 rounded-xl border border-teal-400/20 h-10 transition-all font-poppins"
                         >
                           <Info className="h-4 w-4" /> PORTFOLIO
                         </a>
                       )}
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

export default AppliedJobs;


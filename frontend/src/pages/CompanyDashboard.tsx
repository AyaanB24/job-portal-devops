import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import { Application } from "@/types/Application";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Plus, Trash2, Pencil, Sparkles, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket";

const CompanyDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", "company"],
    queryFn: () => apiService.getCompanyJobs(),
  });

  const { data: applicants = [], isLoading: appLoading } = useQuery({
    queryKey: ["applicants", "company"],
    queryFn: () => apiService.getCompanyApplicants(),
  });

  useEffect(() => {
    socketService.onNewApplication(() => {
      queryClient.invalidateQueries({ queryKey: ["applicants", "company"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "company"] });
    });
  }, [queryClient]);

  const handleDelete = async (id: string) => {
    await apiService.deleteJob(id);
    queryClient.invalidateQueries({ queryKey: ["jobs", "company"] });
    toast({ title: "Job deleted" });
  };

  if (jobsLoading || appLoading) return <Loader />;

  return (
    <div className="container py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <LayoutDashboard className="h-3.5 w-3.5" /> Overview
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Company <span className="text-gradient">Dashboard</span></h1>
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/company/post-job">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-none shadow-xl shadow-blue-500/20 group font-bold">
               <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
               Post New Job
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Posted Jobs", value: jobs.length, icon: Briefcase, color: "blue" },
          { label: "Total Applicants", value: applicants.length, icon: Users, color: "teal" },
          { label: "Active Postings", value: jobs.filter(j => j.status === 'ACTIVE').length, icon: Sparkles, color: "purple" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] border-white/5 bg-slate-900/40 relative overflow-hidden group hover:scale-[1.02] transition-all"
          >
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
               <stat.icon className="h-32 w-32" />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className={`h-16 w-16 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`h-8 w-8 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Job list */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="h-6 w-1.5 bg-blue-500 rounded-full" />
          Manage Listings
        </h2>
        
        {jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass-card rounded-[3rem] border-white/5 space-y-6"
          >
            <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No jobs posted yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">Launch your first recruitment campaign today.</p>
            </div>
            <Link to="/company/post-job">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 rounded-xl">Create Listing</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job, i) => (
              <motion.div 
                key={job.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 md:p-8 rounded-3xl border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group"
              >
                <div className="flex gap-6 items-center flex-1 w-full min-w-0">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xl text-gradient shrink-0">
                    {job.title[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-blue-400" /> {job.location}
                        </p>
                        <p className="text-sm text-teal-400 font-bold flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" /> {job.applicants} applicants
                        </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <Link to={`/company/jobs/${job.id}/applicants`} className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white gap-2 transition-all">
                      View Applicants
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white shrink-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/5 bg-white/5 hover:bg-red-400/10 text-red-400 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem] border-white/5 bg-slate-900/95 backdrop-blur-2xl">
                      <div className="p-4 space-y-6">
                        <div className="h-16 w-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto">
                            <Trash2 className="h-8 w-8 text-red-400" />
                        </div>
                        <AlertDialogHeader className="text-center">
                          <AlertDialogTitle className="text-2xl font-bold text-white">Delete Listing?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground text-lg">
                            This action is irreversible. It will permanently remove the <span className="text-white font-bold">"{job.title}"</span> listing and all applicant data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center gap-4 mt-6">
                          <AlertDialogCancel className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(job.id)} 
                            className="h-12 px-8 rounded-xl bg-red-500 hover:bg-red-400 text-white border-none font-bold"
                          >
                            Delete Job
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;


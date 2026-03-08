import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Application } from "@/types/Application";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, CheckCircle2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket";

const statusColors: any = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  SHORTLISTED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
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
        variant: app.status === 'REJECTED' ? 'destructive' : 'default',
      });
    });
  }, [queryClient, toast]);

  if (isLoading) return <Loader />;

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Applied Jobs</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">No applications yet</h2>
          <p className="text-sm text-muted-foreground">Start applying to jobs to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in shadow-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />
              
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {app.jobTitle}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/70">{app.companyName || (app as any).company}</span>
                      <span>•</span>
                      <span>Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      {app.jobStatus === 'DELETED' && (
                        <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5 py-0 px-2 rounded-full">
                          Closed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-sm ${statusColors[app.status]}`}>
                    {app.status.replace('_', ' ')}
                   </span>
                </div>
              </div>

              {/* Details block */}
              <div className="relative mt-5 pt-5 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Contact Information</p>
                  <p className="text-sm font-medium text-foreground/90 flex items-center gap-2 italic">
                    {app.phoneNumber || "No phone provided"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Relevant Experience</p>
                  <p className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                    {app.experienceYears ? `${app.experienceYears} Years` : "Not specified"}
                  </p>
                </div>
                <div className="sm:col-span-2 md:col-span-1 space-y-2.5">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Application Materials</p>
                   <div className="flex flex-wrap gap-2 pt-0.5">
                     <a 
                       href={app.resumeLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:bg-primary/10 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 transition-colors"
                     >
                       <FileText className="h-4 w-4" />
                       Resume
                     </a>
                     {app.portfolioUrl && (
                       <a 
                         href={app.portfolioUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:bg-accent/10 bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 transition-colors"
                       >
                         <Info className="h-4 w-4" />
                         Portfolio
                       </a>
                     )}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;

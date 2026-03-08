import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import { Application } from "@/types/Application";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-foreground">Company Dashboard</h1>
        <Link to="/company/post-job">
          <Button><Plus className="h-4 w-4 mr-2" />Post New Job</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
            <p className="text-sm text-muted-foreground">Posted Jobs</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{applicants.length}</p>
            <p className="text-sm text-muted-foreground">Total Applicants</p>
          </div>
        </div>
      </div>

      {/* Job list */}
      {jobs.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">No jobs posted yet</h2>
          <p className="text-sm text-muted-foreground">Click "Post New Job" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between gap-4 animate-fade-in">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.location} · {job.applicants} applicants</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/company/jobs/${job.id}/applicants`}>
                  <Button variant="secondary" size="sm" className="hidden sm:inline-flex rounded-full px-4 hover:shadow-md transition-all">
                    View Applicants
                  </Button>
                  <Button variant="secondary" size="sm" className="sm:hidden rounded-full">
                    <Users className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="rounded-full"><Pencil className="h-3 w-3" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full"><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-border bg-card/95 backdrop-blur-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold">Delete this job?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">This will remove the job post and all associated application data permanently.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(job.id)} className="bg-destructive hover:bg-destructive/90 rounded-full">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;

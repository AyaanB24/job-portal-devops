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
  XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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
      // First get job title
      apiService.getJobById(jobId).then(job => {
        if (job) setJobTitle(job.title);
      });

      // Get applicants
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const data = await apiService.getCompanyApplicants();
      // Filter by jobId since the API returns all for now (or I can update API to use specific endpoint if I want, but I already have getCompanyApplicants)
      // Actually apiService.getCompanyApplicants uses applications/job/:id under the hood if I updated it right or according to the existing logic.
      // Let's re-verify apiService.getCompanyApplicants
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
      // Update local state
      setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus as any } : app));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Applicants</h1>
          <p className="text-muted-foreground">Managing candidates for <span className="text-primary font-semibold">{jobTitle}</span></p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-20 bg-card/50 border border-dashed border-border rounded-2xl space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No applications yet</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">When candidates apply for this position, they will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applicants.map((app) => (
            <div 
              key={app.id} 
              className="group relative bg-card hover:bg-accent/5 border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.99]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xl border border-primary/10">
                    {app.applicant?.name?.charAt(0) || "A"}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {app.applicant?.name || "Anonymous Applicant"}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{app.applicant?.email}</span>
                      {app.phoneNumber && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{app.phoneNumber}</span>}
                      {app.experienceYears && <span className="flex items-center gap-1.5 font-medium text-foreground/80"><Briefcase className="h-4 w-4" />{app.experienceYears} Years Exp.</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-xl border border-border/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Status</span>
                  <Select 
                    value={app.status} 
                    onValueChange={(value) => handleStatusChange(app.id, value)}
                  >
                    <SelectTrigger className="w-[180px] h-9 bg-background border-none shadow-sm font-semibold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING" className="text-amber-500 font-medium">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW" className="text-blue-500 font-medium">Under Review</SelectItem>
                      <SelectItem value="SHORTLISTED" className="text-emerald-500 font-medium">Shortlisted</SelectItem>
                      <SelectItem value="REJECTED" className="text-rose-500 font-medium">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Candidate Pitch</h4>
                  <p className="text-sm text-foreground/80 italic leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/30">
                    "{app.coverLetter || "No cover letter provided."}"
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resources</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild className="rounded-full hover:bg-primary/10 transition-colors">
                      <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> View Resume
                      </a>
                    </Button>
                    {app.portfolioUrl && (
                      <Button variant="outline" size="sm" asChild className="rounded-full hover:bg-accent/10 transition-colors">
                        <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer">
                          <UserCheck className="h-4 w-4 mr-2" /> Portfolio
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
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

export default JobApplicants;

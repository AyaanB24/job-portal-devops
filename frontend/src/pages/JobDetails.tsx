import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Users, DollarSign } from "lucide-react";

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
  }, [id]);

  if (loading) return <Loader />;

  if (!job) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Job not found</h2>
        <Link to="/jobs"><Button variant="outline">Back to Jobs</Button></Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{job.title}</h1>
            <p className="text-primary font-medium text-lg">{job.company}</p>
          </div>
          <Badge variant="secondary" className="text-sm">{job.type}</Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Posted {job.postedAt}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{job.applicants} applicants</span>
          {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{job.salary}</span>}
        </div>

        <div className="flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">{s}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Job Description</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
          {job.description}
        </div>
      </div>

      <div className="sticky bottom-4 pt-4">
        <Link to={`/apply/${job.id}`}>
          <Button size="lg" className="w-full sm:w-auto">Apply for this position</Button>
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      apiService.getJobById(id).then((data) => {
        setJob(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || !fileName) {
      toast({ title: "Error", description: "Please provide a cover letter and resume.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await apiService.applyToJob(id!, coverLetter, fileName, phoneNumber, experience, portfolio);
      setSubmitting(false);
      setSuccess(true);
      toast({ title: "Application submitted!", description: "Good luck!" });
      setTimeout(() => navigate("/applications"), 2000);
    } catch (err: any) {
      setSubmitting(false);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader />;

  if (!job) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-xl font-semibold text-foreground">Job not found</h2>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container max-w-md py-16 text-center space-y-4 animate-fade-in">
        <CheckCircle className="h-16 w-16 text-success mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
        <p className="text-muted-foreground">Your application for {job.title} at {job.company} has been sent.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-8 space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Apply to {job.title}</h1>
        <p className="text-primary font-medium">{job.company}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Resume (File name for demo)</Label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {fileName || "Click to upload"}
              </span>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <input 
              id="phone" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
              placeholder="+1 234 567 890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exp">Experience (Years)</Label>
            <input 
              id="exp" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
              placeholder="e.g. 5"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
            <input 
              id="portfolio" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
              placeholder="https://..."
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              type="url"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover">Cover Letter</Label>
          <Textarea
            id="cover"
            placeholder="Tell the employer why you're a great fit..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default ApplyJob;

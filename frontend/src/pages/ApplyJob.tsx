import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, CheckCircle, Briefcase, User, Phone, Globe, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
      <div className="container py-32 text-center space-y-6">
        <div className="h-20 w-20 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mx-auto">
          <Briefcase className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold text-white">Job not found</h2>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container max-w-lg py-32 text-center space-y-8 animate-fade-in px-4">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="h-24 w-24 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto border border-teal-500/30"
        >
          <CheckCircle className="h-12 w-12 text-teal-400" />
        </motion.div>
        <div className="space-y-3">
            <h2 className="text-4xl font-black text-white">Application Sent!</h2>
            <p className="text-xl text-muted-foreground">Your request for <span className="text-white font-bold">{job.title}</span> is now being reviewed by the team.</p>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 2 }}
               className="h-full bg-blue-500" 
            />
        </div>
        <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">Redirecting to your applications...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 space-y-10 px-4">
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" /> Go Back
      </motion.button>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Complete <span className="text-gradient">Application</span></h1>
        <p className="text-xl text-muted-foreground flex items-center gap-2">
            Applying for <span className="text-white font-bold">{job.title}</span> at <span className="text-blue-400 font-bold">{job.companyName || job.company}</span>
        </p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="glass-card p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/40 space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" /> Resume / CV
            </Label>
            <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/10 rounded-3xl p-8 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
              <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-blue-400" />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-white block">
                    {fileName || "Browse your files"}
                </span>
                <span className="text-xs text-muted-foreground mt-1 block">PDF, DOCX up to 10MB</span>
              </div>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </label>
          </div>

          <div className="space-y-4">
            <Label htmlFor="phone" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400" /> Contact Number
            </Label>
            <div className="relative">
                <input 
                  id="phone" 
                  className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium" 
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label htmlFor="exp" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-400" /> Professional Experience
            </Label>
            <input 
              id="exp" 
              className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium" 
              placeholder="e.g. 5 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="portfolio" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-400" /> Portfolio URL
            </Label>
            <input 
              id="portfolio" 
              className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium" 
              placeholder="https://yourportfolio.com"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              type="url"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="cover" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
             <Send className="h-4 w-4 text-blue-400" /> Intro message / Cover Letter
          </Label>
          <Textarea
            id="cover"
            className="w-full rounded-[2rem] border border-white/10 bg-slate-950/50 px-6 py-4 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium min-h-[200px]"
            placeholder="Introduce yourself and explain why you're a standout candidate for this role..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
        </div>

        <div className="pt-6">
          <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-lg font-black shadow-2xl shadow-blue-500/20 group uppercase tracking-widest" disabled={submitting}>
            {submitting ? "Processing Application..." : "Transmit Application"}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
             Your profile data and uploaded documents will be securely shared with the hiring team.
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default ApplyJob;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Briefcase, MapPin, DollarSign, Plus, Sparkles, LayoutPanelTop, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const jobTypes: Job["type"][] = ["Full-time", "Part-time", "Contract", "Remote"];

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<Job["type"]>("Full-time");
  const [salary, setSalary] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await apiService.postJob({ title, description, skills, location, type, salary: salary || undefined });
      setSubmitting(false);
      toast({ title: "Job posted!", description: "Your job listing is now live." });
      navigate("/company/dashboard");
    } catch (err: any) {
      setSubmitting(false);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" /> New Campaign
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Post a <span className="text-gradient">New Listing</span></h1>
        <p className="text-xl text-muted-foreground">Reach out to the next generation of top-tier talent.</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="glass-card p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/40 space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label htmlFor="title" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <Briefcase className="h-4 w-4 text-blue-400" /> Title *
            </Label>
            <input 
              id="title" 
              className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium" 
              placeholder="e.g. Senior Frontend Developer" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="loc" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <MapPin className="h-4 w-4 text-teal-400" /> Location *
            </Label>
            <input 
              id="loc" 
              className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-teal-500/50 focus:ring-0 transition-all outline-none font-medium" 
              placeholder="e.g. New York, NY (Remote)" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="desc" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
             <LayoutPanelTop className="h-4 w-4 text-purple-400" /> Description *
          </Label>
          <Textarea 
            id="desc" 
            className="w-full rounded-[2rem] border border-white/10 bg-slate-950/50 px-6 py-4 text-white placeholder:text-muted-foreground/30 focus:border-purple-500/50 focus:ring-0 transition-all outline-none font-medium min-h-[160px]"
            placeholder="Outline the responsibilities, requirements, and benefits of this position..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                Type
            </Label>
            <div className="flex flex-wrap gap-3 p-1">
              {jobTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                    type === t
                      ? "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                      : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="salary" className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-400" /> Salary / Equity
            </Label>
            <input 
              id="salary" 
              className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-orange-500/50 focus:ring-0 transition-all outline-none font-medium" 
              placeholder="e.g. $140k - $180k + 0.5%" 
              value={salary} 
              onChange={(e) => setSalary(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-400" /> Required Skills
          </Label>
          <div className="flex gap-4">
            <input
              className="flex-1 h-14 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-2 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium"
              placeholder="Add skill (e.g. React, Docker, Rust) and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" variant="outline" className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white" onClick={addSkill}>
                <Plus className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <AnimatePresence>
              {skills.map((s) => (
                <motion.span 
                  key={s} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest group"
                >
                  {s}
                  <button type="button" className="text-blue-400/50 hover:text-red-400 transition-colors" onClick={() => setSkills(skills.filter((sk) => sk !== s))}>
                    <X className="h-4 w-4" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-bold">
                {error}
            </motion.div>
        )}

        <div className="pt-6">
          <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-lg font-black shadow-2xl shadow-blue-500/20 group uppercase tracking-widest" disabled={submitting}>
            {submitting ? "Launching listing..." : "Launch Listing"}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-6 font-medium uppercase tracking-tighter">
             By launching, you agree to our recruitment guidelines and terms of service.
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default PostJob;


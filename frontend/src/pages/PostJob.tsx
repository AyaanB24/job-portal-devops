import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="container max-w-lg py-8 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input id="title" placeholder="e.g. Senior Frontend Developer" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description *</Label>
          <Textarea id="desc" placeholder="Job responsibilities, requirements..." value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loc">Location *</Label>
          <Input id="loc" placeholder="e.g. San Francisco, CA" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Job Type</Label>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  type === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary Range</Label>
          <Input id="salary" placeholder="e.g. $120,000 - $150,000" value={salary} onChange={(e) => setSalary(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((sk) => sk !== s))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
};

export default PostJob;

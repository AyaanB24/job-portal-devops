import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
  if (pw.length < 4) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
  if (pw.length < 8) return { label: "Fair", color: "bg-warning", width: "w-2/4" };
  if (/(?=.*[A-Z])(?=.*\d)/.test(pw)) return { label: "Strong", color: "bg-success", width: "w-full" };
  return { label: "Good", color: "bg-primary", width: "w-3/4" };
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<UserRole, "admin">>("jobseeker");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register({ name, email, password, role });
      toast({ title: "Account created!", description: "Please sign in to continue." });
      navigate("/login");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  const roles: { value: Exclude<UserRole, "admin">; label: string }[] = [
    { value: "jobseeker", label: "Job Seeker" },
    { value: "company", label: "Company" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Briefcase className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground">Start your journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    role === r.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            {password && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`} />
                </div>
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

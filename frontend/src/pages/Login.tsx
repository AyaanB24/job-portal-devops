import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, Lock, Sparkles, ShieldCheck, UserCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [error, setError] = useState("");
  const { login, initializeSession, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      const handleToken = async () => {
        try {
          await initializeSession(token);
          toast({ title: "Welcome back!", description: "Google login successful." });
          navigate("/jobs");
        } catch (err) {
          setError("Google login failed. Please try again.");
        }
      };
      handleToken();
    }
  }, [searchParams, initializeSession, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({ email, password, role });
      const userStr = localStorage.getItem("user");
      const loggedUser = userStr ? JSON.parse(userStr) : null;
      const actualRole = loggedUser?.role;

      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      
      if (actualRole === "admin") navigate("/admin");
      else if (actualRole === "company") navigate("/company/dashboard");
      else navigate("/jobs");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    }
  };

  const roles: { value: UserRole; label: string; icon: any }[] = [
    { value: "jobseeker", label: "Talent", icon: UserCircle },
    { value: "company", label: "Enterprise", icon: Briefcase },
    { value: "admin", label: "Control", icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl space-y-10"
      >
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="h-20 w-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 rotate-12"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tight uppercase">Access <span className="text-gradient">Portal</span></h1>
            <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest">Sign in to your professional workspace</p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[3rem] border-white/5 bg-slate-900/40 shadow-2xl space-y-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Select Interface</Label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                      role === r.value
                        ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20 scale-105"
                        : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <r.icon className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Identifier</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="w-full h-16 pl-14 pr-6 rounded-2xl border border-white/10 bg-slate-950/50 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium"
                    placeholder="name@nexus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Credential</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="w-full h-16 pl-14 pr-6 rounded-2xl border border-white/10 bg-slate-950/50 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-black uppercase tracking-widest text-center">
                    {error}
                </motion.div>
            )}

            <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-sm font-black shadow-2xl shadow-blue-500/20 group uppercase tracking-widest" disabled={isLoading}>
              {isLoading ? "Validating..." : "Initiate Session"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {role === "jobseeker" && (
            <div className="space-y-8 pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-[#0F172A] px-4 text-muted-foreground">Federated Identity</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
          New to the Nexus?{" "}
          <Link to="/register" className="text-blue-400 font-black hover:text-blue-300 transition-colors border-b-2 border-blue-400/20 pb-0.5 ml-2">
            Register Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;


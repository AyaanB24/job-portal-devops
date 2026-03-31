import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Briefcase, User, Mail, Lock, UserCircle, Rocket, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const getPasswordStrength = (pw: string): { label: string; color: string; width: string; text: string } => {
  if (pw.length === 0) return { label: "None", color: "bg-white/5", width: "w-0", text: "text-muted-foreground" };
  if (pw.length < 4) return { label: "Weak", color: "bg-red-500", width: "w-1/4", text: "text-red-400" };
  if (pw.length < 8) return { label: "Fair", color: "bg-amber-500", width: "w-2/4", text: "text-amber-400" };
  if (/(?=.*[A-Z])(?=.*\d)/.test(pw)) return { label: "Strong", color: "bg-emerald-500", width: "w-full", text: "text-emerald-400" };
  return { label: "Good", color: "bg-blue-500", width: "w-3/4", text: "text-blue-400" };
};

const Register = () => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
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
      await register({ name, email, password, role, ...(role === 'company' && { companyName }) });
      if (role === 'company') {
        toast({ title: "Account created!", description: "Please check your email to verify your company identity before signing in." });
      } else {
        toast({ title: "Account created!", description: "Please sign in to continue." });
      }
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    }
  };

  const roles: { value: Exclude<UserRole, "admin">; label: string; icon: any }[] = [
    { value: "jobseeker", label: "Talent", icon: UserCircle },
    { value: "company", label: "Enterprise", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-10"
      >
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-20 w-20 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 -rotate-6"
          >
            <Rocket className="h-10 w-10 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tight uppercase">Join the <span className="text-gradient">Nexus</span></h1>
            <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest">Architect your professional future</p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[3.5rem] border-white/5 bg-slate-900/40 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Identity Type</Label>
              <div className="grid grid-cols-2 gap-4">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all duration-500 ${
                      role === r.value
                        ? "bg-blue-500 border-blue-400 text-white shadow-xl shadow-blue-500/20 scale-105"
                        : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <r.icon className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Legal Name</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    className="w-full h-16 pl-14 pr-6 rounded-2xl border border-white/10 bg-slate-950/50 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Electronic Mail</Label>
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
            </div>

            <AnimatePresence>
              {role === "company" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <Label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Registered Enterprise Name</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <input
                      id="companyName"
                      className="w-full h-16 pl-14 pr-6 rounded-2xl border border-white/10 bg-slate-950/50 text-white placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium"
                      placeholder="Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required={role === "company"}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            <div className="space-y-4">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Security Credential</Label>
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
              
              <AnimatePresence>
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 px-1 overflow-hidden"
                  >
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: strength.width }}
                         className={`h-full ${strength.color} transition-all duration-500`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                       <p className={`text-[10px] font-black uppercase tracking-widest ${strength.text}`}>Strength: {strength.label}</p>
                       <p className="text-[10px] text-muted-foreground font-medium italic">Minimum 6 characters recommended</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-black uppercase tracking-widest text-center">
                    {error}
                </motion.div>
            )}

            <div className="space-y-6">
                <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-sm font-black shadow-2xl shadow-blue-500/20 group uppercase tracking-widest" disabled={isLoading}>
                    {isLoading ? "Provisioning..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {role === "jobseeker" && (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                        <span className="bg-[#0F172A] px-4 text-muted-foreground">Or accelerated signup</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      type="button"
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
          </form>
        </div>

        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Already a resident?{" "}
          <Link to="/login" className="text-blue-400 font-black hover:text-blue-300 transition-colors border-b-2 border-blue-400/20 pb-0.5 ml-2">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;


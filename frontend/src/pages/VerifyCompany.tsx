import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyCompany = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your company identity...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    apiService
      .verifyCompany(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link might be expired.");
      });
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 md:p-14 rounded-[3.5rem] border-white/5 bg-slate-900/40 shadow-2xl max-w-lg w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          {status === "loading" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="h-24 w-24 rounded-full border-[4px] border-blue-500/20 border-t-blue-500 flex items-center justify-center"
            >
              <Loader2 className="h-10 w-10 text-blue-400 animate-pulse" />
            </motion.div>
          )}
          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-24 w-24 rounded-full bg-rose-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            >
              <XCircle className="h-12 w-12 text-rose-400" />
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            {status === "loading" && "Protocol Initialization"}
            {status === "success" && "Identity Verified"}
            {status === "error" && "Verification Failed"}
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
            {message}
          </p>
        </div>

        {status !== "loading" && (
          <div className="pt-6">
            <Link to="/login">
              <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-sm font-black shadow-xl shadow-blue-500/20 uppercase tracking-widest">
                Proceed to Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyCompany;

import { Job } from "@/types/Job";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02, translateY: -5 }}
    transition={{ duration: 0.3 }}
    className="group rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-transparent hover:from-primary/50 hover:to-accent/50 transition-all duration-500"
  >
    <div className="h-full rounded-2xl glass-card p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="h-12 w-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-lg text-gradient">
            {job.companyName?.[0] || job.company?.[0] || "J"}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-secondary-foreground font-medium flex items-center gap-1">
              {job.companyName || job.company}
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-slate-800 text-blue-400 border-white/5 px-3 py-1 text-xs">
          {job.type}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-[2.5rem]">
        {job.shortDescription}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/80">
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-blue-400" />{job.location}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-teal-400" />{job.postedAt}</span>
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-purple-400" />{job.applicants} applicants</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((s) => (
          <span key={s} className="px-3 py-1 rounded-lg bg-slate-800/80 border border-white/5 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
            {s}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            +{job.skills.length - 3}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm" className="w-full h-10 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white gap-2 transition-all">
            Details
          </Button>
        </Link>
        {job.applicationStatus ? (
          <Button variant="secondary" size="sm" className="w-full h-10 rounded-xl bg-slate-800/80 text-muted-foreground border-white/5" disabled>
            Applied
          </Button>
        ) : (
          <Link to={`/apply/${job.id}`}>
            <Button size="sm" className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-none shadow-lg shadow-blue-500/20 group/btn transition-all">
              Apply <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  </motion.div>
);

export default JobCard;


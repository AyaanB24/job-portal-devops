import { Job } from "@/types/Job";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => (
  <div className="group rounded-lg border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 animate-fade-in">
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
          <p className="text-sm text-primary font-medium">{job.companyName || job.company}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {job.type}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{job.shortDescription}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{job.applicants} applicants</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
            {s}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
            +{job.skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </Link>
        {job.applicationStatus ? (
          <Button variant="secondary" size="sm" className="flex-1" disabled>
            Applied ({job.applicationStatus})
          </Button>
        ) : (
          <Link to={`/apply/${job.id}`} className="flex-1">
            <Button size="sm" className="w-full">Apply</Button>
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default JobCard;

import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Job } from "@/types/Job";
import JobCard from "@/components/JobCard";
import { SkeletonCard } from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket";

const JobList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => apiService.getJobs(),
  });

  useEffect(() => {
    socketService.onNewJob(() => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    });
  }, [queryClient]);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesLocation =
      !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="container py-8 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Find Your Dream Job
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Discover opportunities from top companies around the world
        </p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">No jobs found</h2>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{filtered.length} jobs found</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;

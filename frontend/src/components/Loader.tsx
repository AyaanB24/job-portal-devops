const Loader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

export const SkeletonCard = () => (
  <div className="rounded-lg border border-border bg-card p-5 space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-3 w-1/3 bg-muted rounded" />
      </div>
      <div className="h-5 w-16 bg-muted rounded-full" />
    </div>
    <div className="h-3 w-full bg-muted rounded" />
    <div className="h-3 w-2/3 bg-muted rounded" />
    <div className="flex gap-2">
      <div className="h-5 w-16 bg-muted rounded-full" />
      <div className="h-5 w-16 bg-muted rounded-full" />
    </div>
    <div className="flex gap-2">
      <div className="h-8 flex-1 bg-muted rounded" />
      <div className="h-8 flex-1 bg-muted rounded" />
    </div>
  </div>
);

export default Loader;

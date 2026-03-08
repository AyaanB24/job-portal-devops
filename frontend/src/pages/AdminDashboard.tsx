import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { User } from "@/types/User";
import { Job } from "@/types/Job";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Building2, Ban, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([apiService.getAllUsers(), apiService.getAllJobs()]).then(([u, j]) => {
      setUsers(u);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  const handleBlockUser = async (id: string) => {
    await apiService.blockUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User blocked" });
  };

  const handleRemoveJob = async (id: string) => {
    await apiService.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast({ title: "Job removed" });
  };

  if (loading) return <Loader />;

  const companies = users.filter((u) => u.role === "company");

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{companies.length}</p>
            <p className="text-sm text-muted-foreground">Companies</p>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Users</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><span className="capitalize">{u.role}</span></TableCell>
                  <TableCell className="text-right">
                    {u.role !== "admin" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm"><Ban className="h-3 w-3 mr-1" />Block</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Block {u.name}?</AlertDialogTitle>
                            <AlertDialogDescription>This will remove the user from the platform.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleBlockUser(u.id)}>Block</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Jobs table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Jobs</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.title}</TableCell>
                  <TableCell className="text-muted-foreground">{j.company}</TableCell>
                  <TableCell className="text-muted-foreground">{j.location}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm"><Trash2 className="h-3 w-3 mr-1 text-destructive" />Remove</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove this job?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveJob(j.id)}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

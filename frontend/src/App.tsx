import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import JobList from "@/pages/JobList";
import JobDetails from "@/pages/JobDetails";
import ApplyJob from "@/pages/ApplyJob";
import AppliedJobs from "@/pages/AppliedJobs";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CompanyDashboard from "@/pages/CompanyDashboard";
import JobApplicants from "@/pages/JobApplicants";
import PostJob from "@/pages/PostJob";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

import { NotificationProvider } from "@/contexts/NotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<JobList />} />
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/apply/:id"
                    element={
                      <ProtectedRoute allowedRoles={["jobseeker", "company", "admin"]}>
                        <ApplyJob />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applications"
                    element={
                      <ProtectedRoute allowedRoles={["jobseeker", "company", "admin"]}>
                        <AppliedJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/company/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["company"]}>
                        <CompanyDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/company/jobs/:jobId/applicants"
                    element={
                      <ProtectedRoute allowedRoles={["company"]}>
                        <JobApplicants />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/company/post-job"
                    element={
                      <ProtectedRoute allowedRoles={["company"]}>
                        <PostJob />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React, { createContext, useContext, useEffect } from "react";
import { socketService } from "@/services/socket";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const NotificationContext = createContext<any>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            socketService.connect(user.id);

            socketService.onNewJob((job) => {
                toast.info("New Job Posted!", {
                    description: `${job.title} at ${job.companyName || job.company?.name || 'a new company'}`,
                    action: {
                        label: "View",
                        onClick: () => window.location.href = `/jobs/${job.id}`,
                    },
                });
            });

            socketService.onApplicationStatusUpdate((app) => {
                toast.success("Application Updated!", {
                    description: `Your application for ${app.jobTitle || app.job?.title} is now ${app.status}`,
                });
            });

            socketService.onNewApplication((app) => {
                if (app.type === 'ADMIN_NOTIFICATION') {
                    toast.message("Admin: New Application", {
                        description: `${app.applicant?.name} applied for ${app.job?.title} at ${app.job?.companyName || 'a company'}`,
                    });
                } else {
                    toast.message("New Application Received!", {
                        description: `${app.applicant?.name} applied for your job: ${app.job?.title}`,
                    });
                }
            });
        }

        return () => {
            socketService.disconnect();
        };
    }, [user]);

    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);

import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(SOCKET_URL, {
            query: { userId },
            transports: ["websocket"],
        });

        this.socket.on("connect", () => {
            console.log("Connected to Real-time Notifications");
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from Real-time Notifications");
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onNewJob(callback: (job: any) => void) {
        this.socket?.on("NEW_JOB", callback);
    }

    onApplicationStatusUpdate(callback: (app: any) => void) {
        this.socket?.on("APPLICATION_STATUS_UPDATE", callback);
    }

    onNewApplication(callback: (app: any) => void) {
        this.socket?.on("NEW_APPLICATION", callback);
    }
}

export const socketService = new SocketService();

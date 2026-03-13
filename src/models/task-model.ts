export interface TaskModel {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    deadline: string;
    created_at: string;
    fileUrl?: string;
    userId: string;
}
